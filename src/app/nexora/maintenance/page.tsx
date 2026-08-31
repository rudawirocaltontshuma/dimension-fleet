"use client";

import { AlertOctagon, CalendarClock, DollarSign, Wrench } from "lucide-react";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/nexora/data-table";
import { KpiCard } from "@/components/nexora/kpi-card";
import { PageHeader } from "@/components/nexora/page-header";
import { StatusBadge } from "@/components/nexora/status-badge";
import { fmtDate, fmtMoney2 } from "@/lib/nexora/format";
import { MAINTENANCE_RECORDS, vehicleLabel } from "@/lib/nexora/generate";
import type { MaintenanceRecord } from "@/lib/nexora/types";

const columns: ColumnDef<MaintenanceRecord>[] = [
  {
    key: "vehicle",
    header: "Vehicle",
    sortValue: (m) => vehicleLabel(m.vehicleId),
    cell: (m) => vehicleLabel(m.vehicleId),
  },
  { key: "type", header: "Maintenance Type", sortValue: (m) => m.maintenanceType, cell: (m) => m.maintenanceType },
  { key: "date", header: "Date", sortValue: (m) => m.date, cell: (m) => fmtDate(m.date) },
  { key: "mileage", header: "Mileage", sortValue: (m) => m.mileage, cell: (m) => `${m.mileage.toLocaleString()} mi` },
  { key: "cost", header: "Cost", sortValue: (m) => m.cost, cell: (m) => fmtMoney2(m.cost) },
  { key: "status", header: "Status", sortValue: (m) => m.status, cell: (m) => <StatusBadge status={m.status} /> },
];

const filters: FilterDef<MaintenanceRecord>[] = [
  {
    key: "status",
    label: "Status",
    options: ["Upcoming", "In Progress", "Completed", "Overdue"],
    predicate: (m, v) => m.status === v,
  },
];

export default function MaintenancePage() {
  const upcoming = MAINTENANCE_RECORDS.filter((m) => m.status === "Upcoming").length;
  const inMaintenance = new Set(MAINTENANCE_RECORDS.filter((m) => m.status === "In Progress").map((m) => m.vehicleId))
    .size;
  const cost = MAINTENANCE_RECORDS.reduce((s, m) => s + m.cost, 0);
  const overdue = MAINTENANCE_RECORDS.filter((m) => m.status === "Overdue").length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Maintenance" description="Track fleet maintenance schedules, costs, and overdue service." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Upcoming Service" value={String(upcoming)} icon={CalendarClock} accent="sky" />
        <KpiCard label="Vehicles in Maintenance" value={String(inMaintenance)} icon={Wrench} accent="amber" />
        <KpiCard label="Maintenance Cost" value={fmtMoney2(cost)} icon={DollarSign} accent="primary" />
        <KpiCard label="Overdue Service" value={String(overdue)} icon={AlertOctagon} accent="red" />
      </div>

      <DataTable
        data={MAINTENANCE_RECORDS}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by vehicle or maintenance type..."
        searchFn={(m, q) => [vehicleLabel(m.vehicleId), m.maintenanceType].some((f) => f.toLowerCase().includes(q))}
      />
    </div>
  );
}
