"use client";

import { Boxes, Gauge, MapPin, Truck, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CHART_COLORS, ChartCard } from "@/components/dimension-fleet/charts/chart-card";
import { KpiCard } from "@/components/dimension-fleet/kpi-card";
import { PageHeader } from "@/components/dimension-fleet/page-header";
import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { topVehicleTypesByCount } from "@/lib/dimension-fleet/aggregate";
import { LOCATIONS, VEHICLES } from "@/lib/dimension-fleet/generate";

export default function FleetPage() {
  const byType = topVehicleTypesByCount();
  const totalCapacity = VEHICLES.reduce((s, v) => s + v.capacityTons, 0);
  const avgMileage = Math.round(VEHICLES.reduce((s, v) => s + v.mileage, 0) / VEHICLES.length);
  const statuses: { status: (typeof VEHICLES)[number]["status"]; label: string }[] = [
    { status: "Available", label: "Available" },
    { status: "On Trip", label: "On Trip" },
    { status: "Maintenance", label: "Maintenance" },
    { status: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Fleet" description="Fleet-wide composition, capacity, and depot distribution." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Fleet Size" value={String(VEHICLES.length)} icon={Truck} accent="primary" />
        <KpiCard label="Total Capacity" value={`${totalCapacity.toFixed(1)} t`} icon={Boxes} accent="sky" />
        <KpiCard label="Avg. Mileage" value={`${avgMileage.toLocaleString()} mi`} icon={Gauge} accent="amber" />
        <KpiCard label="Depots" value={String(LOCATIONS.length)} icon={MapPin} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Vehicles by Type" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={110} />
              <Tooltip />
              <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} name="Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {statuses.map((s) => {
              const count = VEHICLES.filter((v) => v.status === s.status).length;
              const pct = Math.round((count / VEHICLES.length) * 100);
              return (
                <div key={s.status} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <StatusBadge status={s.status} />
                    <span className="text-muted-foreground">
                      {count} vehicles ({pct}%)
                    </span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-medium text-sm">Depot Distribution</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">{loc.name}</p>
                <p className="text-muted-foreground text-xs">
                  {loc.city}, {loc.state}
                </p>
              </div>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Wrench className="size-3.5 text-muted-foreground" />
                {loc.vehicleIds.length}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
