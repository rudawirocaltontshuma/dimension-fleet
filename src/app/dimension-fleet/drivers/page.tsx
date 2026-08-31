"use client";

import Link from "next/link";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/dimension-fleet/data-table";
import { PageHeader } from "@/components/dimension-fleet/page-header";
import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/dimension-fleet/format";
import { DRIVERS, vehicleLabel } from "@/lib/dimension-fleet/generate";
import type { Driver } from "@/lib/dimension-fleet/types";

const columns: ColumnDef<Driver>[] = [
  {
    key: "driver",
    header: "Driver",
    sortValue: (d) => d.name,
    cell: (d) => (
      <Link href={`/dimension-fleet/drivers/${d.id}`} className="flex items-center gap-2 font-medium hover:underline">
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
