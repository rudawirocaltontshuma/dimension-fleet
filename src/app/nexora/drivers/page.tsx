"use client";

import Link from "next/link";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/nexora/data-table";
import { PageHeader } from "@/components/nexora/page-header";
import { StatusBadge } from "@/components/nexora/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/nexora/format";
import { DRIVERS, vehicleLabel } from "@/lib/nexora/generate";
import type { Driver } from "@/lib/nexora/types";

const columns: ColumnDef<Driver>[] = [
  {
    key: "driver",
    header: "Driver",
    sortValue: (d) => d.name,
    cell: (d) => (
      <Link href={`/nexora/drivers/${d.id}`} className="flex items-center gap-2 font-medium hover:underline">
        <Avatar className="size-7">
          <AvatarFallback className="text-[10px]">{initials(d.name)}</AvatarFallback>
        </Avatar>
        {d.name}
      </Link>
    ),
  },
  { key: "code", header: "Driver ID", sortValue: (d) => d.driverCode, cell: (d) => d.driverCode },
  { key: "vehicle", header: "Vehicle", cell: (d) => vehicleLabel(d.vehicleId) },
  { key: "trips", header: "Trips", sortValue: (d) => d.tripsCompleted, cell: (d) => d.tripsCompleted },
  {
    key: "deliveries",
    header: "Deliveries",
    sortValue: (d) => d.deliveriesCompleted,
    cell: (d) => d.deliveriesCompleted,
  },
  {
    key: "performance",
    header: "Performance",
    sortValue: (d) => d.performanceScore,
    cell: (d) => `${d.performanceScore}/100`,
  },
  { key: "safety", header: "Safety Score", sortValue: (d) => d.safetyScore, cell: (d) => `${d.safetyScore}/100` },
  { key: "status", header: "Status", sortValue: (d) => d.status, cell: (d) => <StatusBadge status={d.status} /> },
];

const filters: FilterDef<Driver>[] = [
  {
    key: "status",
    label: "Status",
    options: ["Active", "On Trip", "Off Duty", "Suspended"],
    predicate: (d, v) => d.status === v,
  },
];

export default function DriversPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Drivers" description={`Manage the ${DRIVERS.length}-driver roster.`} />
      <DataTable
        data={DRIVERS}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by name, driver ID..."
        searchFn={(d, q) => [d.name, d.driverCode, d.email].some((f) => f.toLowerCase().includes(q))}
      />
    </div>
  );
}
