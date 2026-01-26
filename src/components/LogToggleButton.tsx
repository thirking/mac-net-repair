import { useLogStore } from "@/stores/log-store";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";

export function LogToggleButton() {
  const { logs, toggleVisible } = useLogStore();
  const errorCount = logs.filter((l) => l.level === "error").length;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleVisible}
      className="relative"
    >
      <ScrollText className="h-4 w-4 mr-1" />
      日志
      {errorCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {errorCount > 9 ? "9+" : errorCount}
        </span>
      )}
    </Button>
  );
}
