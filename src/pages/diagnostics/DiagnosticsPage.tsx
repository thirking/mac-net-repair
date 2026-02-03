import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Play, Clock, Search } from "lucide-react";

export function DiagnosticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Ping 测试
            </CardTitle>
            <CardDescription>测试到目标地址的网络连通性</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="输入目标地址，例如: baidu.com"
                className="flex-1"
              />
              <Button>
                <Play className="h-4 w-4 mr-1" />
                开始
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-[var(--color-muted)] font-mono text-sm min-h-32">
              <p className="text-[var(--color-muted-foreground)]">
                等待执行...
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              DNS 查询
            </CardTitle>
            <CardDescription>查询域名的 DNS 解析结果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="输入域名，例如: apple.com"
                className="flex-1"
              />
              <Button>
                <Play className="h-4 w-4 mr-1" />
                查询
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-[var(--color-muted)] font-mono text-sm min-h-32">
              <p className="text-[var(--color-muted-foreground)]">
                等待执行...
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速诊断</CardTitle>
            <CardDescription>一键测试常用网站的连通性</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>百度 (baidu.com)</span>
                <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">未测试</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Google (google.com)</span>
                <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">未测试</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>GitHub (github.com)</span>
                <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">未测试</span>
                </div>
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-4">
              <Activity className="h-4 w-4 mr-2" />
              一键测试全部
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
