"use client";

import Link from "next/link";

import { Activity, AlertTriangle, CheckCircle2, Fuel, Gauge, Package, Truck, Wrench } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS, ChartCard } from "@/components/dimension-fleet/charts/chart-card";
import { KpiCard } from "@/components/dimension-fleet/kpi-card";
import { PageHeader } from "@/components/dimension-fleet/page-header";
import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deliveryPerformanceByMonth,
  fleetUtilizationByMonth,
  fuelConsumptionByMonth,
  maintenanceCostByMonth,
  tripActivityByMonth,
  vehicleStatusBreakdown,
} from "@/lib/dimension-fleet/aggregate";
import { TODAY_ISO } from "@/lib/dimension-fleet/constants";
import { fmtDate, fmtMoney } from "@/lib/dimension-fleet/format";
import {
  DELIVERIES,
  driverName,
  FUEL_RECORDS,
  INCIDENTS,
  MAINTENANCE_RECORDS,
  TRIPS,
  VEHICLES,
  vehicleLabel,
} from "@/lib/dimension-fleet/generate";

export default function DashboardPage() {
  const totalVehicles = VEHICLES.length;
  const active = VEHICLES.filter((v) => v.status === "On Trip").length;
  const available = VEHICLES.filter((v) => v.status === "Available").length;
  const inMaintenance = VEHICLES.filter((v) => v.status === "Maintenance").length;
  const activeTrips = TRIPS.filter((t) => t.status === "In Transit" || t.status === "Dispatched").length;
  const today = new Date(TODAY_ISO).toDateString();
  const deliveriesToday = DELIVERIES.filter((d) => new Date(d.scheduled).toDateString() === today).length;
  const delivered = DELIVERIES.filter((d) => d.status === "Delivered").length;
  const onTimeRate = Math.round(
    (delivered /
      DELIVERIES.filter((d) => d.status === "Delivered" || d.status === "Delayed" || d.status === "Failed").length) *
      100,
  );
  const avgMpg = Math.round((FUEL_RECORDS.reduce((s, r) => s + r.efficiencyMpg, 0) / FUEL_RECORDS.length) * 10) / 10;

  const recentIncidents = [...INCIDENTS].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5);
  const upcomingMaintenance = MAINTENANCE_RECORDS.filter((m) => m.status === "Upcoming" || m.status === "Overdue")
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Dashboard" description="Real-time overview of the DIMENSION FLEET operation." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <KpiCard label="Total Vehicles" value={String(totalVehicles)} icon={Truck} accent="primary" />
        <KpiCard label="Active Vehicles" value={String(active)} icon={Activity} accent="sky" />
        <KpiCard label="Available" value={String(available)} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="In Maintenance" value={String(inMaintenance)} icon={Wrench} accent="amber" />
        <KpiCard label="Active Trips" value={String(activeTrips)} icon={Gauge} accent="sky" />
        <KpiCard label="Deliveries Today" value={String(deliveriesToday)} icon={Package} accent="primary" />
        <KpiCard label="On-Time Rate" value={`${onTimeRate}%`} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Fuel Efficiency" value={`${avgMpg} mpg`} icon={Fuel} accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Fleet Utilization" description="Estimated utilization over the last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fleetUtilizationByMonth()}>
              <defs>
                <linearGradient id="util" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} unit="%" width={40} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="utilization"
                stroke={CHART_COLORS[0]}
                fill="url(#util)"
                strokeWidth={2}
                name="Utilization %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Status" description="Current fleet status distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={vehicleStatusBreakdown()}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {vehicleStatusBreakdown().map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Delivery Performance" description="Delivered vs. delayed vs. failed by month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deliveryPerformanceByMonth()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
              <Tooltip />
              <Bar dataKey="delivered" stackId="a" fill={CHART_COLORS[2]} name="Delivered" radius={[0, 0, 0, 0]} />
              <Bar dataKey="delayed" stackId="a" fill={CHART_COLORS[3]} name="Delayed" />
              <Bar dataKey="failed" stackId="a" fill={CHART_COLORS[4]} name="Failed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fuel Consumption" description="Monthly gallons consumed">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fuelConsumptionByMonth()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="gallons"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                dot={false}
                name="Gallons"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Cost" description="Monthly maintenance spend">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maintenanceCostByMonth()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={50}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip formatter={(v) => fmtMoney(Number(v))} />
              <Bar dataKey="cost" fill={CHART_COLORS[5]} radius={[4, 4, 0, 0]} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trip Activity" description="Trips departed per month">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tripActivityByMonth()}>
              <defs>
                <linearGradient id="trips" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="trips"
                stroke={CHART_COLORS[2]}
                fill="url(#trips)"
                strokeWidth={2}
                name="Trips"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-sm">Recent Incidents</CardTitle>
            <Link href="/dimension-fleet/incidents" className="text-primary text-xs hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recentIncidents.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between gap-3 rounded-lg border p-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm">{inc.description}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {vehicleLabel(inc.vehicleId)} • {driverName(inc.driverId)} • {fmtDate(inc.date)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge variant={inc.severity === "Critical" || inc.severity === "High" ? "destructive" : "secondary"}>
                    {inc.severity}
                  </Badge>
                  <StatusBadge status={inc.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-sm">Upcoming Maintenance</CardTitle>
            <Link href="/dimension-fleet/maintenance" className="text-primary text-xs hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcomingMaintenance.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border p-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Wrench className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm">{m.maintenanceType}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {vehicleLabel(m.vehicleId)} • {fmtDate(m.date)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
