import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
        {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
      </CardHeader>
      <CardContent className="h-[260px] px-2 sm:px-4">{children}</CardContent>
    </Card>
  );
}

export const CHART_COLORS = ["#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
