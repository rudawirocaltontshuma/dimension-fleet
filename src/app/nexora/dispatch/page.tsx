"use client";

import { useMemo, useState } from "react";

import { GripVertical, MapPin, Package, Truck, User } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/nexora/page-header";
import { fmtDate } from "@/lib/nexora/format";
import { DELIVERIES, driverName, routeById, vehicleLabel } from "@/lib/nexora/generate";
import type { DispatchStage } from "@/lib/nexora/types";
import { cn } from "@/lib/utils";

const STAGES: DispatchStage[] = ["Unassigned", "Assigned", "Dispatched", "In Transit", "Completed"];

interface Card {
  id: string;
  deliveryNumber: string;
  customer: string;
  driver: string;
  vehicle: string;
  route: string;
  time: string;
  stage: DispatchStage;
}

function initialCards(): Card[] {
  const stageForStatus: Record<string, DispatchStage> = {
    Scheduled: "Unassigned",
    Dispatched: "Dispatched",
    "In Transit": "In Transit",
    Delivered: "Completed",
    Delayed: "In Transit",
    Failed: "Assigned",
  };
  return DELIVERIES.slice(0, 60).map((d) => ({
    id: d.id,
    deliveryNumber: d.deliveryNumber,
    customer: d.customer,
    driver: driverName(d.driverId),
    vehicle: vehicleLabel(d.vehicleId),
    route: routeById.get(d.routeId)?.routeCode ?? "—",
    time: fmtDate(d.scheduled),
    stage: stageForStatus[d.status] ?? "Unassigned",
  }));
}

export default function DispatchPage() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [dragId, setDragId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<DispatchStage, Card[]> = {
      Unassigned: [],
      Assigned: [],
      Dispatched: [],
      "In Transit": [],
      Completed: [],
    };
    for (const c of cards) map[c.stage].push(c);
    return map;
  }, [cards]);

  function moveCard(id: string, stage: DispatchStage) {
    setCards((prev) => {
      const card = prev.find((c) => c.id === id);
      if (!card || card.stage === stage) return prev;
      toast.success(`${card.deliveryNumber} moved to ${stage}`);
      return prev.map((c) => (c.id === id ? { ...c, stage } : c));
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dispatch Board"
        description="Drag delivery cards between stages to simulate dispatch operations. Changes are in-memory only."
      />

      <div className="flex gap-4 overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: HTML5 drag-and-drop drop zone
          <div
            key={stage}
            className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border bg-muted/30 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragId) moveCard(dragId, stage);
              setDragId(null);
            }}
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="font-semibold text-sm">{stage}</h3>
              <span className="rounded-full bg-background px-2 py-0.5 text-muted-foreground text-xs">
                {grouped[stage].length}
              </span>
            </div>
            <div className="flex min-h-[60px] flex-col gap-2">
              {grouped[stage].map((card) => (
                // biome-ignore lint/a11y/noStaticElementInteractions: HTML5 drag-and-drop card
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => setDragId(card.id)}
                  onDragEnd={() => setDragId(null)}
                  className={cn(
                    "cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-opacity active:cursor-grabbing",
                    dragId === card.id && "opacity-50",
                  )}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-semibold text-xs">{card.deliveryNumber}</span>
                    <GripVertical className="size-3.5 text-muted-foreground" />
                  </div>
                  <p className="mb-2 truncate text-muted-foreground text-xs">{card.customer}</p>
                  <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3" /> {card.driver}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Truck className="size-3" /> {card.vehicle}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3" /> {card.route} • {card.time}
                    </span>
                  </div>
                </div>
              ))}
              {grouped[stage].length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 text-muted-foreground text-xs">
                  <Package className="mr-1.5 size-3.5" /> Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
