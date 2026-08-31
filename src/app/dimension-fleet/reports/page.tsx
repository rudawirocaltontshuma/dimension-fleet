"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  Download,
  Fuel,
  type LucideIcon,
  MapPinned,
  Package,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dimension-fleet/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fmtMoney2 } from "@/lib/dimension-fleet/format";
import {
  DELIVERIES,
  DRIVERS,
  FUEL_RECORDS,
  INCIDENTS,
  MAINTENANCE_RECORDS,
  TRIPS,
  VEHICLES,
} from "@/lib/dimension-fleet/generate";

interface ReportDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  stats: { label: string; value: string }[];
  rows: { label: string; value: string }[];
}

const REPORTS: ReportDef[] = [
  {
    id: "fleet",
    title: "Fleet Report",
    description: "Fleet-wide composition and status summary.",
    icon: Boxes,
    stats: [
      { label: "Total Vehicles", value: String(VEHICLES.length) },
      { label: "Available", value: String(VEHICLES.filter((v) => v.status === "Available").length) },
      { label: "On Trip", value: String(VEHICLES.filter((v) => v.status === "On Trip").length) },
    ],
    rows: [
      { label: "In Maintenance", value: String(VEHICLES.filter((v) => v.status === "Maintenance").length) },
      { label: "Inactive", value: String(VEHICLES.filter((v) => v.status === "Inactive").length) },
      {
        label: "Average Mileage",
        value: `${Math.round(VEHICLES.reduce((s, v) => s + v.mileage, 0) / VEHICLES.length).toLocaleString()} mi`,
      },
    ],
  },
  {
    id: "vehicle",
    title: "Vehicle Report",
    description: "Per-vehicle utilization and lifecycle stats.",
    icon: Truck,
    stats: [
      { label: "Fleet Size", value: String(VEHICLES.length) },
      {
        label: "Avg. Fuel Level",
        value: `${Math.round(VEHICLES.reduce((s, v) => s + v.fuelLevel, 0) / VEHICLES.length)}%`,
      },
      {
        label: "Avg. Capacity",
        value: `${(VEHICLES.reduce((s, v) => s + v.capacityTons, 0) / VEHICLES.length).toFixed(1)} t`,
      },
    ],
    rows: [
      { label: "Newest Vehicle Year", value: String(Math.max(...VEHICLES.map((v) => v.year))) },
      { label: "Oldest Vehicle Year", value: String(Math.min(...VEHICLES.map((v) => v.year))) },
    ],
  },
  {
    id: "driver",
    title: "Driver Report",
    description: "Driver roster performance and safety summary.",
    icon: Users,
    stats: [
      { label: "Total Drivers", value: String(DRIVERS.length) },
      {
        label: "Avg. Performance",
        value: `${Math.round(DRIVERS.reduce((s, d) => s + d.performanceScore, 0) / DRIVERS.length)}/100`,
      },
      {
        label: "Avg. Safety Score",
        value: `${Math.round(DRIVERS.reduce((s, d) => s + d.safetyScore, 0) / DRIVERS.length)}/100`,
      },
    ],
    rows: [
      { label: "Active Drivers", value: String(DRIVERS.filter((d) => d.status === "Active").length) },
      { label: "Suspended Drivers", value: String(DRIVERS.filter((d) => d.status === "Suspended").length) },
    ],
  },
  {
    id: "trip",
    title: "Trip Report",
    description: "Trip volume and completion summary.",
    icon: MapPinned,
    stats: [
      { label: "Total Trips", value: String(TRIPS.length) },
      { label: "Completed", value: String(TRIPS.filter((t) => t.status === "Completed").length) },
      { label: "In Transit", value: String(TRIPS.filter((t) => t.status === "In Transit").length) },
    ],
    rows: [
      { label: "Total Miles", value: `${TRIPS.reduce((s, t) => s + t.distanceMiles, 0).toLocaleString()} mi` },
      { label: "Cancelled Trips", value: String(TRIPS.filter((t) => t.status === "Cancelled").length) },
    ],
  },
  {
    id: "delivery",
    title: "Delivery Report",
    description: "Delivery outcomes and on-time performance.",
    icon: Package,
    stats: [
      { label: "Total Deliveries", value: String(DELIVERIES.length) },
      { label: "Delivered", value: String(DELIVERIES.filter((d) => d.status === "Delivered").length) },
      {
        label: "Delayed / Failed",
        value: String(DELIVERIES.filter((d) => d.status === "Delayed" || d.status === "Failed").length),
      },
    ],
    rows: [
      {
        label: "Total Weight Shipped",
        value: `${Math.round(DELIVERIES.reduce((s, d) => s + d.weightLbs, 0) / 2000).toLocaleString()} tons`,
      },
    ],
  },
  {
    id: "fuel",
    title: "Fuel Report",
    description: "Fuel usage, cost, and efficiency summary.",
    icon: Fuel,
    stats: [
      {
        label: "Total Gallons",
        value: `${Math.round(FUEL_RECORDS.reduce((s, f) => s + f.volumeGallons, 0)).toLocaleString()}`,
      },
      { label: "Total Fuel Cost", value: fmtMoney2(FUEL_RECORDS.reduce((s, f) => s + f.cost, 0)) },
      {
        label: "Avg. Efficiency",
        value: `${(FUEL_RECORDS.reduce((s, f) => s + f.efficiencyMpg, 0) / FUEL_RECORDS.length).toFixed(1)} mpg`,
      },
    ],
    rows: [],
  },
  {
    id: "maintenance",
    title: "Maintenance Report",
    description: "Maintenance costs and scheduling summary.",
    icon: ClipboardCheck,
    stats: [
      { label: "Total Records", value: String(MAINTENANCE_RECORDS.length) },
      { label: "Total Cost", value: fmtMoney2(MAINTENANCE_RECORDS.reduce((s, m) => s + m.cost, 0)) },
      { label: "Overdue", value: String(MAINTENANCE_RECORDS.filter((m) => m.status === "Overdue").length) },
    ],
    rows: [],
  },
  {
    id: "incident",
    title: "Incident Report",
    description: "Safety incident summary by severity.",
    icon: AlertTriangle,
    stats: [
      { label: "Total Incidents", value: String(INCIDENTS.length) },
      {
        label: "Open / Investigating",
        value: String(INCIDENTS.filter((i) => i.status === "Open" || i.status === "Investigating").length),
      },
      { label: "Critical", value: String(INCIDENTS.filter((i) => i.severity === "Critical").length) },
    ],
    rows: [],
  },
];

export default function ReportsPage() {
  const [active, setActive] = useState<ReportDef | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Reports" description="Generate summary reports across every fleet operations module." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <r.icon className="size-4.5" />
              </div>
              <div>
                <CardTitle className="font-semibold text-sm">{r.title}</CardTitle>
                <p className="text-muted-foreground text-xs">{r.description}</p>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setActive(r)}>
                View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
            <DialogDescription>{active?.description}</DialogDescription>
          </DialogHeader>
          {active && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                {active.stats.map((s) => (
                  <div key={s.label} className="rounded-lg border p-2.5 text-center">
                    <p className="font-semibold text-lg">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              {active.rows.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {active.rows.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell className="text-right">{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                toast.success(`${active?.title} exported.`, {
                  description: "This is a demo export — no file was generated.",
                });
              }}
            >
              <Download /> Generate / Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
