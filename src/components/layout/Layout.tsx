import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { LogViewer } from "@/components/LogViewer";
import { LogToggleButton } from "@/components/LogToggleButton";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto pb-16">
        <div className="flex justify-end mb-4">
          <LogToggleButton />
        </div>
        <Outlet />
      </main>
      <LogViewer />
    </div>
  );
}
