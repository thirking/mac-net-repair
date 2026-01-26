import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HardwarePort } from "@/stores/network-store";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hardwarePorts: HardwarePort[];
  onAdd: (name: string, hardwarePort: string) => Promise<void>;
  isLoading: boolean;
}

export function AddServiceDialog({
  open,
  onOpenChange,
  hardwarePorts,
  onAdd,
  isLoading,
}: AddServiceDialogProps) {
  const [name, setName] = useState("");
  const [selectedPort, setSelectedPort] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("请输入服务名称");
      return;
    }

    if (!selectedPort) {
      setError("请选择硬件端口");
      return;
    }

    try {
      await onAdd(name.trim(), selectedPort);
      setName("");
      setSelectedPort("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加服务失败");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setSelectedPort("");
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加网络服务</DialogTitle>
          <DialogDescription>
            选择一个硬件端口并为新的网络服务命名
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">服务名称</Label>
              <Input
                id="name"
                placeholder="例如：Wi-Fi 2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="port">硬件端口</Label>
              <Select
                value={selectedPort}
                onValueChange={setSelectedPort}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择硬件端口" />
                </SelectTrigger>
                <SelectContent>
                  {hardwarePorts.map((port) => (
                    <SelectItem key={port.device} value={port.name}>
                      {port.name} ({port.device})
                      {port.inUse && " - 已使用"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <p className="text-sm text-[var(--color-destructive)]">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "添加中..." : "添加"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
