import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Plus, Minus, RefreshCw, Loader2, Cpu, Check } from "lucide-react";
import { useNetworkStore } from "@/stores/network-store";
import type { NetworkService, HardwarePort } from "@/stores/network-store";
import {
  getNetworkServices,
  setServiceOrder,
  getAvailableHardwarePorts,
  createNetworkService,
  removeNetworkService,
} from "@/services/network-api";
import {
  NetworkServiceList,
  AddServiceDialog,
  RemoveServiceDialog,
} from "./components";
import { logger } from "@/stores/log-store";

export function NetworkCardsPage() {
  const {
    services,
    setServices,
    isLoadingServices,
    setLoadingServices,
    availableHardwarePorts,
    setAvailableHardwarePorts,
    error,
    setError,
  } = useNetworkStore();

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isOperating, setIsOperating] = useState(false);

  // Transform API response to store format
  const transformService = (service: {
    name: string;
    hardware_port: string;
    device: string;
    enabled: boolean;
    is_default: boolean;
    order: number;
    status: string;
  }): NetworkService => ({
    name: service.name,
    hardwarePort: service.hardware_port,
    device: service.device,
    enabled: service.enabled,
    isDefault: service.is_default,
    order: service.order,
    status: service.status as NetworkService["status"],
  });

  const transformHardwarePort = (port: {
    name: string;
    device: string;
    in_use: boolean;
  }): HardwarePort => ({
    name: port.name,
    device: port.device,
    inUse: port.in_use,
  });

  const loadServices = useCallback(async () => {
    setLoadingServices(true);
    setError(null);
    try {
      const [servicesData, portsData] = await Promise.all([
        getNetworkServices(),
        getAvailableHardwarePorts(),
      ]);
      setServices(servicesData.map(transformService));
      setAvailableHardwarePorts(portsData.map(transformHardwarePort));
      logger.info("成功加载网络服务列表");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "加载网络服务失败";
      setError(errorMsg);
      logger.error("加载网络服务失败", String(err));
    } finally {
      setLoadingServices(false);
    }
  }, [setLoadingServices, setError, setServices, setAvailableHardwarePorts]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleReorder = async (newServices: NetworkService[]) => {
    const previousServices = [...services];

    // Optimistic update
    setServices(newServices);
    logger.info("正在调整网络服务优先级...");

    try {
      await setServiceOrder(newServices.map((s) => s.name));
      logger.info("成功调整网络服务优先级");
    } catch (err) {
      // Revert on error
      setServices(previousServices);
      const errorMsg = err instanceof Error ? err.message : "调整优先级失败";
      setError(errorMsg);
      logger.error("调整网络服务优先级失败", String(err));
    }
  };

  const handleAddService = async (name: string, hardwarePort: string) => {
    setIsOperating(true);
    logger.info(`正在添加网络服务: ${name}`);
    try {
      await createNetworkService(name, hardwarePort);
      logger.info(`成功添加网络服务: ${name}`);
      await loadServices();
    } catch (err) {
      logger.error(`添加网络服务失败: ${name}`, String(err));
      throw err;
    } finally {
      setIsOperating(false);
    }
  };

  const handleRemoveService = async () => {
    if (!selectedService) return;

    setIsOperating(true);
    logger.info(`正在移除网络服务: ${selectedService}`);
    try {
      await removeNetworkService(selectedService);
      logger.info(`成功移除网络服务: ${selectedService}`);
      setSelectedService(null);
      await loadServices();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "移除服务失败";
      setError(errorMsg);
      logger.error(`移除网络服务失败: ${selectedService}`, String(err));
      throw err;
    } finally {
      setIsOperating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">网卡管理</h1>
        <p className="text-[var(--color-muted-foreground)]">
          查看和管理网络接口及服务优先级
        </p>
      </div>

      {error && (
        <div className="p-4 border border-[var(--color-destructive)] bg-[var(--color-destructive)]/10 rounded-lg">
          <p className="text-sm text-[var(--color-destructive)]">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setError(null);
              loadServices();
            }}
          >
            重试
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  网络服务列表
                </CardTitle>
                <CardDescription>
                  当前系统中已配置的网络服务，拖拽调整优先级顺序
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadServices}
                disabled={isLoadingServices}
              >
                {isLoadingServices ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-1">刷新</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingServices && services.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-muted-foreground)]" />
                <span className="ml-2 text-[var(--color-muted-foreground)]">
                  加载中...
                </span>
              </div>
            ) : (
              <NetworkServiceList
                services={services}
                selectedService={selectedService}
                onSelectService={setSelectedService}
                onReorder={handleReorder}
              />
            )}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                disabled={isLoadingServices || isOperating}
              >
                <Plus className="h-4 w-4 mr-1" />
                添加服务
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRemoveDialogOpen(true)}
                disabled={
                  !selectedService ||
                  isLoadingServices ||
                  isOperating ||
                  services.length <= 1
                }
              >
                <Minus className="h-4 w-4 mr-1" />
                移除服务
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              可用硬件端口
            </CardTitle>
            <CardDescription>
              系统中的所有硬件网络端口，可用于创建新的网络服务
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingServices && availableHardwarePorts.length === 0 ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-muted-foreground)]" />
              </div>
            ) : availableHardwarePorts.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">
                没有找到硬件端口
              </p>
            ) : (
              <div className="grid gap-2">
                {availableHardwarePorts.map((port) => (
                  <div
                    key={port.device}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{port.name}</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {port.device}
                      </p>
                    </div>
                    {port.inUse && (
                      <span className="flex items-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        已配置
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-[var(--color-muted-foreground)] space-y-2">
              <li>
                • <strong>网络服务</strong>：已配置的网络连接，拖拽可调整优先级，排在第一位的为默认服务
              </li>
              <li>
                • <strong>硬件端口</strong>：物理网络接口，可用于创建新的网络服务
              </li>
              <li>• 点击选中一个服务后，可以使用"移除服务"按钮删除该服务</li>
              <li>• 部分操作需要管理员权限，系统会弹出授权对话框</li>
              <li>• 绿色图标表示已连接，灰色表示未连接，红色表示不可用</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <AddServiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        hardwarePorts={availableHardwarePorts}
        onAdd={handleAddService}
        isLoading={isOperating}
      />

      <RemoveServiceDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        serviceName={selectedService}
        onConfirm={handleRemoveService}
        isLoading={isOperating}
      />
    </div>
  );
}
