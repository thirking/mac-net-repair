import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ProxyConfig } from "@/types/proxy";

interface ProxyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  config: ProxyConfig;
  onSave: (enabled: boolean, server: string, port: number) => Promise<void>;
}

export function ProxyCard({
  title,
  description,
  icon,
  config,
  onSave,
}: ProxyCardProps) {
  const [enabled, setEnabled] = useState(config.enabled);
  const [server, setServer] = useState(config.server);
  const [port, setPort] = useState(config.port.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with prop updates
  useEffect(() => {
    setEnabled(config.enabled);
    setServer(config.server);
    setPort(config.port.toString());
    setHasChanges(false);
  }, [config]);

  // Check for changes
  useEffect(() => {
    const portNum = parseInt(port) || 0;
    const isChanged =
      enabled !== config.enabled ||
      server !== config.server ||
      portNum !== config.port;
    setHasChanges(isChanged);
  }, [enabled, server, port, config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(enabled, server, parseInt(port) || 0);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    // If toggling and we have valid config, save immediately
    // Otherwise just update local state to allow editing
    if (server && port) {
        setIsSaving(true);
        try {
            await onSave(checked, server, parseInt(port) || 0);
        } finally {
            setIsSaving(false);
        }
    } else {
        setHasChanges(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isSaving}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label htmlFor={`server-${title}`}>服务器地址</Label>
              <Input
                id={`server-${title}`}
                placeholder="例如: 127.0.0.1"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                disabled={!enabled && !config.enabled} // Disable if disabled and saved
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`port-${title}`}>端口</Label>
              <Input
                id={`port-${title}`}
                placeholder="例如: 8080"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                disabled={!enabled && !config.enabled}
              />
            </div>
          </div>

          {hasChanges && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                保存更改
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
