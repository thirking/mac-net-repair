import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { LogViewer } from "@/components/LogViewer";
import { LogToggleButton } from "@/components/LogToggleButton";
import { isMacOS, getTrafficLightSafeAreaClasses } from "@/utils/platform";

export function Layout() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    isMacOS().then(setIsMac);
  }, []);

  const safeAreaClasses = getTrafficLightSafeAreaClasses(isMac);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <main className={`flex-1 px-6 overflow-auto pb-16 ${safeAreaClasses}`}>
        <Outlet />
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <LogToggleButton />
      </div>
      <LogViewer />
    </div>
  );
}
