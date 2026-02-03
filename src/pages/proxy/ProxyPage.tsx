import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Globe, Lock, Trash2, Loader2, AlertCircle } from "lucide-react";
import { ProxyCard } from "@/components/ProxyCard";
import { ProxySettings } from "@/types/proxy";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ProxyPage() {
  const [settings, setSettings] = useState<ProxySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the primary service name first - assuming "Wi-Fi" or similar logic from other pages
      // Ideally we should get the active service name dynamically
      // For now, let's hardcode "Wi-Fi" as per existing patterns, or fetch active service
      // The backend get_proxy_settings requires a service name.
      // Let's assume we can get it from somewhere or default to Wi-Fi.
      // TODO: Use a robust way to get the active network service.
      const serviceName = "Wi-Fi"; // Temporary default
      const data = await invoke<ProxySettings>("get_proxy_settings", {
        serviceName,
      });
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch proxy settings:", err);
      setError(typeof err === "string" ? err : "获取代理设置失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateHttp = async (enabled: boolean, server: string, port: number) => {
    if (!settings) return;
    try {
      await invoke("set_http_proxy", {
        serviceName: settings.service_name,
        enabled,
        server,
        port,
      });
      setNotification({ type: 'success', message: "HTTP 代理设置已更新" });
      await fetchSettings();
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: "更新 HTTP 代理失败" });
      throw err;
    }
  };

  const handleUpdateHttps = async (enabled: boolean, server: string, port: number) => {
    if (!settings) return;
    try {
      await invoke("set_https_proxy", {
        serviceName: settings.service_name,
        enabled,
        server,
        port,
      });
      setNotification({ type: 'success', message: "HTTPS 代理设置已更新" });
      await fetchSettings();
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: "更新 HTTPS 代理失败" });
      throw err;
    }
  };

  const handleUpdateSocks = async (enabled: boolean, server: string, port: number) => {
    if (!settings) return;
    try {
      await invoke("set_socks_proxy", {
        serviceName: settings.service_name,
        enabled,
        server,
        port,
      });
      setNotification({ type: 'success', message: "SOCKS 代理设置已更新" });
      await fetchSettings();
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: "更新 SOCKS 代理失败" });
      throw err;
    }
  };

  const handleClearAll = async () => {
    if (!settings) return;
    if (!confirm("确定要清除所有代理设置吗？这将禁用所有代理。")) return;

    setIsClearing(true);
    try {
      await invoke("clear_all_proxies", { serviceName: settings.service_name });
      setNotification({ type: 'success', message: "已清除所有代理设置" });
      await fetchSettings();
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: "清除代理设置失败" });
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Alert variant={notification.type === 'success' ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{notification.type === 'success' ? "成功" : "错误"}</AlertTitle>
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

      {settings && (
        <div className="grid gap-4">
          <ProxyCard
            title="HTTP 代理"
            description="Web 代理设置"
            icon={<Globe className="h-5 w-5" />}
            config={settings.http_proxy}
            onSave={handleUpdateHttp}
          />

          <ProxyCard
            title="HTTPS 代理"
            description="安全 Web 代理设置"
            icon={<Lock className="h-5 w-5" />}
            config={settings.https_proxy}
            onSave={handleUpdateHttps}
          />

          <ProxyCard
            title="SOCKS 代理"
            description="SOCKS 防火墙代理设置"
            icon={<Shield className="h-5 w-5" />}
            config={settings.socks_proxy}
            onSave={handleUpdateSocks}
          />

          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleClearAll}
                disabled={isClearing}
              >
                {isClearing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                一键清除所有代理
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
