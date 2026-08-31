import type { RouteStop } from "@/lib/nexora/types";

// Stylized, abstract (non-geographic) route visualization — pure SVG, no map library.
export function RouteMap({
  origin,
  destination,
  stops,
  status,
}: {
  origin: string;
  destination: string;
  stops: RouteStop[];
  status: string;
}) {
  const points = [0, ...stops.map((_, i) => (i + 1) / (stops.length + 1)), 1];
  const color = status === "Active" ? "#2563eb" : status === "Completed" ? "#10b981" : "#94a3b8";

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <svg viewBox="0 0 300 70" className="w-full" role="img" aria-label={`Route from ${origin} to ${destination}`}>
        <line
          x1="15"
          y1="35"
          x2="285"
          y2="35"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={status === "Planned" ? "4 4" : undefined}
        />
        {points.map((p, i) => {
          const x = 15 + p * 270;
          const isEnd = i === 0 || i === points.length - 1;
          return (
            <g key={i}>
              <circle cx={x} cy={35} r={isEnd ? 6 : 4} fill={isEnd ? color : "white"} stroke={color} strokeWidth="2" />
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex items-center justify-between text-muted-foreground text-xs">
        <span className="max-w-[45%] truncate font-medium text-foreground">{origin}</span>
        {stops.length > 0 && (
          <span>
            {stops.length} stop{stops.length > 1 ? "s" : ""}
          </span>
        )}
        <span className="max-w-[45%] truncate text-right font-medium text-foreground">{destination}</span>
      </div>
    </div>
  );
}
