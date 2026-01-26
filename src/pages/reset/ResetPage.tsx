import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

export function ResetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">网络重置</h1>
        <p className="text-[var(--color-muted-foreground)]">
          一键重置网络配置，修复常见网络问题
        </p>
      </div>

      <div className="grid gap-4">
        <Card className="border-yellow-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              操作警告
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              网络重置操作会清除所有自定义网络配置，包括 DNS 设置、代理设置等。
              此操作需要管理员权限，请确保保存重要配置后再执行。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>重置操作</CardTitle>
            <CardDescription>选择需要执行的重置操作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">刷新 DNS 缓存</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    清除本地 DNS 缓存，解决域名解析问题
                  </p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  执行
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">清除代理设置</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    移除所有系统代理配置
                  </p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  执行
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">重置 DNS 为默认</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    恢复 DNS 为 DHCP 自动获取
                  </p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  执行
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              一键全部重置
            </CardTitle>
            <CardDescription>
              执行所有重置操作，全面修复网络问题
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              执行全部重置
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>操作日志</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-[var(--color-muted)] font-mono text-sm min-h-32 max-h-48 overflow-auto">
              <p className="text-[var(--color-muted-foreground)]">
                暂无操作记录
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
