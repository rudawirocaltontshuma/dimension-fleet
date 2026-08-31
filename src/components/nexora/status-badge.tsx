import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  // Vehicle / general positive
  Available: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Closed: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Valid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Pass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Planned: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  // In progress / transit
  "On Trip": "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  Dispatched: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  "In Transit": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "In Progress": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Scheduled: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Upcoming: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Investigating: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Expiring Soon": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Pass with Notes": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  // Warnings / negative
  Maintenance: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Delayed: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  High: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Inactive: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  "Off Duty": "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
  Cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  Failed: "bg-red-500/10 text-red-600 dark:text-red-400",
  Suspended: "bg-red-500/10 text-red-600 dark:text-red-400",
  Fail: "bg-red-500/10 text-red-600 dark:text-red-400",
  Critical: "bg-red-500/10 text-red-600 dark:text-red-400",
  Expired: "bg-red-500/10 text-red-600 dark:text-red-400",
  Open: "bg-red-500/10 text-red-600 dark:text-red-400",
  Low: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const color = COLOR_MAP[status] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-medium text-xs",
        color,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
