import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  accent = "primary",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  trend?: { value: string; positive: boolean };
  accent?: "primary" | "emerald" | "amber" | "red" | "sky";
}) {
  const accentMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };
  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex items-start justify-between gap-3 px-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-muted-foreground text-xs">{label}</span>
          <span className="font-semibold text-2xl tracking-tight">{value}</span>
          {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
          {trend ? (
            <span
              className={cn(
                "font-medium text-xs",
                trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {trend.value}
            </span>
          ) : null}
        </div>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", accentMap[accent])}>
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}
