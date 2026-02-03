import { NavLink } from "react-router-dom";
import {
  Network,
  Shield,
  Globe,
  Activity,
  RefreshCw,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "首页" },
  { to: "/network-cards", icon: Network, label: "网卡管理" },
  { to: "/proxy", icon: Shield, label: "代理管理" },
  { to: "/dns", icon: Globe, label: "DNS 管理" },
  { to: "/diagnostics", icon: Activity, label: "网络诊断" },
  { to: "/reset", icon: RefreshCw, label: "网络重置" },
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-[var(--color-border)] bg-[var(--color-card)] h-screen sticky top-0">
      {/* 标题栏区域 - 可见且可拖拽 */}
      <div data-tauri-drag-region className="flex items-center pt-10 pb-3">
        <h1
          data-tauri-drag-region
          className="text-lg font-semibold select-none text-center w-full"
        >
          Mac 网络修复
        </h1>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                      : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
