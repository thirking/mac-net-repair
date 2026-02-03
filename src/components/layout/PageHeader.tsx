import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header
      data-tauri-drag-region
      className="flex items-center justify-between h-14 px-6 border-b border-[var(--color-border)] bg-[var(--color-card)]"
    >
      <div data-tauri-drag-region className="flex flex-col justify-center">
        <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        {description && (
          <p className="text-xs text-[var(--color-muted-foreground)] leading-tight mt-0.5">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
