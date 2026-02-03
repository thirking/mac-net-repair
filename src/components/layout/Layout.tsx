import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { PageHeader } from "./PageHeader";
import { LogViewer } from "@/components/LogViewer";
import { LogToggleButton } from "@/components/LogToggleButton";

const pageConfigs: Record<string, { title: string; description?: string }> = {
  "/": { title: "首页", description: "诊断和修复 macOS 网络问题" },
  "/network-cards": { title: "网卡管理", description: "查看和管理网络接口" },
  "/proxy": { title: "代理管理", description: "检测和清除系统代理" },
  "/dns": { title: "DNS 管理", description: "查看和配置 DNS 服务器" },
  "/diagnostics": { title: "网络诊断", description: "Ping 测试和连通性检查" },
  "/reset": { title: "网络重置", description: "一键重置网络配置" },
};

export function Layout() {
  const location = useLocation();
  const currentPage = pageConfigs[location.pathname] || { title: "" };

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PageHeader
          title={currentPage.title}
          description={currentPage.description}
          actions={<LogToggleButton />}
        />
        <main className="flex-1 overflow-auto pb-6 pt-6">
          <div className="px-6">
            <Outlet />
          </div>
        </main>
      </div>
      <LogViewer />
    </div>
  );
}
