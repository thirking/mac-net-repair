import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Server, RefreshCw, Save, Trash2 } from "lucide-react";

export function DnsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">DNS 管理</h1>
        <p className="text-[var(--color-muted-foreground)]">
          查看和配置 DNS 服务器设置
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              当前 DNS 服务器
            </CardTitle>
            <CardDescription>
              系统当前使用的 DNS 服务器列表
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4" />
                  <span className="font-mono">8.8.8.8</span>
                </div>
                <span className="text-sm text-[var(--color-muted-foreground)]">Google DNS</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4" />
                  <span className="font-mono">8.8.4.4</span>
                </div>
                <span className="text-sm text-[var(--color-muted-foreground)]">Google DNS</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-1" />
              刷新
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>设置自定义 DNS</CardTitle>
            <CardDescription>
              输入自定义 DNS 服务器地址
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">主 DNS 服务器</label>
              <Input placeholder="例如: 8.8.8.8" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">备用 DNS 服务器</label>
              <Input placeholder="例如: 8.8.4.4" />
            </div>
            <div className="flex gap-2">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                保存设置
              </Button>
              <Button variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                恢复默认
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DNS 缓存</CardTitle>
            <CardDescription>
              刷新本地 DNS 缓存
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新 DNS 缓存
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
