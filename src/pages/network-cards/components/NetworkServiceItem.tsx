import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Wifi, Cable, Star, AlertCircle } from "lucide-react";
import type { NetworkService, InterfaceStatus } from "@/stores/network-store";

interface NetworkServiceItemProps {
  service: NetworkService;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

function getStatusIcon(status: InterfaceStatus, hardwarePort: string) {
  const isWifi = hardwarePort.toLowerCase().includes("wi-fi") ||
                 hardwarePort.toLowerCase().includes("wifi");

  if (status === "Connected") {
    return isWifi ? (
      <Wifi className="h-4 w-4 text-green-500" />
    ) : (
      <Cable className="h-4 w-4 text-green-500" />
    );
  } else if (status === "Disconnected") {
    return isWifi ? (
      <Wifi className="h-4 w-4 text-gray-400" />
    ) : (
      <Cable className="h-4 w-4 text-gray-400" />
    );
  } else {
    return <AlertCircle className="h-4 w-4 text-red-400" />;
  }
}

function getStatusText(status: InterfaceStatus): string {
  switch (status) {
    case "Connected":
      return "已连接";
    case "Disconnected":
      return "未连接";
    case "Unavailable":
      return "不可用";
  }
}

export function NetworkServiceItem({ service, isSelected, onSelect }: NetworkServiceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center justify-between p-3 border rounded-lg cursor-pointer
        transition-colors
        ${isDragging ? "opacity-50 shadow-lg" : ""}
        ${isSelected
          ? "border-[var(--color-primary)] bg-[var(--color-accent)]"
          : "hover:bg-[var(--color-accent)]/50"
        }
      `}
      onClick={() => onSelect(service.name)}
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing touch-none p-1 hover:bg-[var(--color-muted)] rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-[var(--color-muted-foreground)]" />
        </button>
        {getStatusIcon(service.status, service.hardwarePort)}
        <div>
          <p className="font-medium">{service.name}</p>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {service.device} - {getStatusText(service.status)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {service.isDefault && (
          <>
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-[var(--color-muted-foreground)]">默认</span>
          </>
        )}
      </div>
    </div>
  );
}
