import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Globe,
  Server,
  RefreshCw,
  Save,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  getNetworkServices,
  getDnsServers,
  setDnsServers as saveDnsServers,
  flushDnsCache,
  NetworkService,
} from "@/services/network-api";
import { logger } from "@/stores/log-store";

export function DnsPage() {
  // Network services
  const [services, setServices] = useState<NetworkService[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");

  // DNS servers
  const [dnsServers, setDnsServers] = useState<string[]>([]);
  const [originalDnsServers, setOriginalDnsServers] = useState<string[]>([]);
  const [newDnsAddress, setNewDnsAddress] = useState("");

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Loading states
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingDns, setIsLoadingDns] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);

  // Error and notification
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load network services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Load DNS servers when selected service changes
  const handleServiceChange = (newService: string) => {
    if (hasChanges) {
      const confirmed = confirm(
        "当前 DNS 配置有未保存的更改，切换服务将丢失这些更改。是否继续？"
      );
      if (!confirmed) return;
    }
    setSelectedService(newService);
  };

  useEffect(() => {
    if (selectedService) {
      loadDnsServers(selectedService);
    }
  }, [selectedService]);

  const loadServices = async () => {
    setIsLoadingServices(true);
    setError(null);
    try {
      const data = await getNetworkServices();
      setServices(data);
      // Select first enabled service by default
      const defaultService = data.find((s) => s.enabled) || data[0];
      if (defaultService) {
        setSelectedService(defaultService.name);
      }
    } catch (err) {
      const errorMsg = typeof err === "string" ? err : "加载网络服务失败";
      logger.error("加载网络服务失败", String(err));
      setError(errorMsg);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadDnsServers = async (serviceName: string) => {
    setIsLoadingDns(true);
    setError(null);
    try {
      const data = await getDnsServers(serviceName);
      setDnsServers(data.servers);
      setOriginalDnsServers(data.servers);
    } catch (err) {
      const errorMsg = typeof err === "string" ? err : "加载 DNS 服务器失败";
      logger.error("加载 DNS 服务器失败", String(err));
      setError(errorMsg);
      setDnsServers([]);
      setOriginalDnsServers([]);
    } finally {
      setIsLoadingDns(false);
    }
  };

  // Check if there are unsaved changes
  const hasChanges =
    JSON.stringify(dnsServers.sort()) !==
    JSON.stringify(originalDnsServers.sort());

  // Validate IP address (IPv4 or IPv6)
  const isValidIpAddress = (address: string): boolean => {
    // IPv4 pattern
    const ipv4Pattern =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // IPv6 pattern (simplified, allows standard and compressed forms)
    const ipv6Pattern =
      /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)*:$|^:(?::[0-9a-fA-F]{1,4})+$/;

    return ipv4Pattern.test(address) || ipv6Pattern.test(address);
  };

  const handleAddDnsServer = () => {
    const address = newDnsAddress.trim();

    if (!address) {
      setNotification({ type: "error", message: "请输入 DNS 服务器地址" });
      return;
    }

    if (!isValidIpAddress(address)) {
      setNotification({ type: "error", message: "请输入有效的 IP 地址" });
      return;
    }

    if (dnsServers.includes(address)) {
      setNotification({ type: "error", message: "该 DNS 服务器已存在" });
      return;
    }

    setDnsServers([...dnsServers, address]);
    setNewDnsAddress("");
    setIsAddDialogOpen(false);
    setNotification({ type: "success", message: "DNS 服务器已添加" });
  };

  const handleRemoveDnsServer = (address: string) => {
    setDnsServers(dnsServers.filter((s) => s !== address));
  };

  const handleClearAll = () => {
    if (dnsServers.length === 0) return;
    if (!confirm("确定要清空所有 DNS 服务器吗？")) return;
    setDnsServers([]);
    setNotification({ type: "success", message: "DNS 列表已清空，请保存设置" });
  };

  const handleApplyDns = async () => {
    if (!selectedService) {
      setNotification({ type: "error", message: "请先选择网络服务" });
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveDnsServers(selectedService, dnsServers);
      logger.info(
        "DNS 设置已应用",
        `服务: ${selectedService}, DNS: ${dnsServers.join(", ")}`
      );
      setOriginalDnsServers([...dnsServers]);
      setNotification({ type: "success", message: result || "DNS 设置已应用" });
    } catch (err) {
      logger.error("应用 DNS 设置失败", String(err));
      setNotification({
        type: "error",
        message: typeof err === "string" ? err : "应用 DNS 设置失败",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFlushDnsCache = async () => {
    setIsFlushing(true);
    try {
      const result = await flushDnsCache();
      logger.info("DNS 缓存已刷新", result);
      setNotification({ type: "success", message: result });
    } catch (err) {
      logger.error("刷新 DNS 缓存失败", String(err));
      setNotification({
        type: "error",
        message: typeof err === "string" ? err : "刷新 DNS 缓存失败",
      });
    } finally {
      setIsFlushing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddDnsServer();
    }
  };

  if (isLoadingServices) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Alert variant={notification.type === "success" ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{notification.type === "success" ? "成功" : "错误"}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {/* Service Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              选择网络服务
            </CardTitle>
            <CardDescription>选择要配置 DNS 的网络服务</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择网络服务" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.name} value={service.name}>
                    {service.name} ({service.hardware_port})
                    {service.enabled ? " - 已启用" : " - 已禁用"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Current DNS Servers with Toolbar */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                当前 DNS 服务器
              </CardTitle>
              <CardDescription className="mt-1.5">
                {selectedService
                  ? `${selectedService} 的 DNS 服务器列表`
                  : "系统当前使用的 DNS 服务器列表"}
              </CardDescription>
            </div>
            {/* Toolbar */}
            <div className="flex items-center gap-2">
              {hasChanges ? (
                <>
                  <span className="text-xs text-amber-500 font-medium mr-1">
                    已修改
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDnsServers([...originalDnsServers]);
                      setNotification({
                        type: "success",
                        message: "已重置为原始配置",
                      });
                    }}
                    disabled={!selectedService}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    重置
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyDns}
                    disabled={isSaving || !selectedService}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    应用
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadDnsServers(selectedService)}
                    disabled={!selectedService || isLoadingDns}
                  >
                    {isLoadingDns ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                    disabled={!selectedService}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={dnsServers.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDns ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : dnsServers.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-muted-foreground)]">
                <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>未配置自定义 DNS 服务器</p>
                <p className="text-sm">系统将使用默认 DNS 配置</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dnsServers.map((server, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                      <span className="font-mono">{server}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDnsServer(server)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* DNS Cache */}
        <Card>
          <CardHeader>
            <CardTitle>DNS 缓存</CardTitle>
            <CardDescription>刷新本地 DNS 缓存</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleFlushDnsCache}
              disabled={isFlushing}
            >
              {isFlushing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              刷新 DNS 缓存
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add DNS Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加 DNS 服务器</DialogTitle>
            <DialogDescription>
              输入自定义 DNS 服务器地址。支持 IPv4 和 IPv6 格式。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="例如: 8.8.8.8 或 2001:4860:4860::8888"
              value={newDnsAddress}
              onChange={(e) => setNewDnsAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <p className="text-xs text-[var(--color-muted-foreground)]">
              IPv4: 8.8.8.8, 114.114.114.114
              <br />
              IPv6: 2001:4860:4860::8888, 240c::6666
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddDnsServer}>
              <Plus className="h-4 w-4 mr-2" />
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
