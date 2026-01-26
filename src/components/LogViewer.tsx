import { useLogStore, type LogLevel } from "@/stores/log-store";
import { Button } from "@/components/ui/button";
import { X, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function getLevelColor(level: LogLevel): string {
  switch (level) {
    case "error":
      return "text-red-500";
    case "warn":
      return "text-yellow-500";
    case "info":
      return "text-blue-500";
    case "debug":
      return "text-gray-500";
  }
}

function getLevelBg(level: LogLevel): string {
  switch (level) {
    case "error":
      return "bg-red-500/10";
    case "warn":
      return "bg-yellow-500/10";
    case "info":
      return "bg-blue-500/10";
    case "debug":
      return "bg-gray-500/10";
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function LogViewer() {
  const { logs, isVisible, setVisible, clearLogs } = useLogStore();
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  if (!isVisible) return null;

  const toggleExpand = (id: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-[var(--color-background)] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-[var(--color-muted)]/30">
        <h3 className="text-sm font-medium">日志 ({logs.length})</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            className="h-7 px-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisible(false)}
            className="h-7 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center py-4 text-[var(--color-muted-foreground)] text-sm">
            暂无日志
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`px-4 py-2 text-sm ${getLevelBg(log.level)}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-[var(--color-muted-foreground)] text-xs whitespace-nowrap">
                    {formatTime(log.timestamp)}
                  </span>
                  <span
                    className={`text-xs font-medium uppercase whitespace-nowrap ${getLevelColor(log.level)}`}
                  >
                    [{log.level}]
                  </span>
                  <span className="flex-1 break-all">{log.message}</span>
                  {log.details && (
                    <button
                      onClick={() => toggleExpand(log.id)}
                      className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    >
                      {expandedLogs.has(log.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                {log.details && expandedLogs.has(log.id) && (
                  <pre className="mt-2 p-2 bg-[var(--color-muted)] rounded text-xs overflow-x-auto whitespace-pre-wrap break-all">
                    {log.details}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
