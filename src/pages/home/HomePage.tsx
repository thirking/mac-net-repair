import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Shield, Globe, Activity, RefreshCw, ArrowRight } from "lucide-react";

const features = [
  {
    to: "/network-cards",
    icon: Network,
    title: "网卡管理",
    description: "查看和管理网络接口",
  },
  {
    to: "/proxy",
    icon: Shield,
    title: "代理管理",
    description: "检测和清除系统代理",
  },
  {
    to: "/dns",
    icon: Globe,
    title: "DNS 管理",
    description: "查看和配置 DNS 服务器",
  },
  {
    to: "/diagnostics",
    icon: Activity,
    title: "网络诊断",
    description: "Ping 测试和连通性检查",
  },
  {
    to: "/reset",
    icon: RefreshCw,
    title: "网络重置",
    description: "一键重置网络配置",
  },
];

export function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Mac 网络修复工具
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          诊断和修复 macOS 网络问题
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Card key={feature.to} className="hover:border-[var(--color-primary)] transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <feature.icon className="h-5 w-5" />
                {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link to={feature.to}>
                  进入
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
