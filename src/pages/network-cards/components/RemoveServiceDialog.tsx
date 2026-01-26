import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string | null;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export function RemoveServiceDialog({
  open,
  onOpenChange,
  serviceName,
  onConfirm,
  isLoading,
}: RemoveServiceDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Error is handled by the parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认移除网络服务</DialogTitle>
          <DialogDescription>
            您确定要移除网络服务 <strong>"{serviceName}"</strong> 吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "移除中..." : "确认移除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
