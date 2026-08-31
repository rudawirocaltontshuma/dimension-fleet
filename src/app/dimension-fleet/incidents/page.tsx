"use client";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/dimension-fleet/data-table";
import { PageHeader } from "@/components/dimension-fleet/page-header";
import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { fmtDate } from "@/lib/dimension-fleet/format";
import { driverName, INCIDENTS, vehicleLabel } from "@/lib/dimension-fleet/generate";
import type { Incident } from "@/lib/dimension-fleet/types";

const columns: ColumnDef<Incident>[] = [
  {
    key: "incident",
    header: "Incident",
    sortValue: (i) => i.incidentNumber,
    cell: (i) => (
      <div>
        <div className="font-medium">{i.incidentNumber}</div>
        <div className="max-w-56 truncate text-muted-foreground text-xs">{i.description}</div>
      </div>
    ),
  },
  { key: "vehicle", header: "Vehicle", cell: (i) => vehicleLabel(i.vehicleId) },
  { key: "driver", header: "Driver", cell: (i) => driverName(i.driverId) },
  { key: "date", header: "Date", sortValue: (i) => i.date, cell: (i) => fmtDate(i.date) },
  { key: "location", header: "Location", sortValue: (i) => i.location, cell: (i) => i.location },
  {
    key: "severity",
    header: "Severity",
    sortValue: (i) => i.severity,
    cell: (i) => <StatusBadge status={i.severity} />,
  },
  { key: "status", header: "Status", sortValue: (i) => i.status, cell: (i) => <StatusBadge status={i.status} /> },
];

const filters: FilterDef<Incident>[] = [
  {
    key: "severity",
    label: "Severity",
    options: ["Low", "Medium", "High", "Critical"],
    predicate: (i, v) => i.severity === v,
  },
  {
    key: "status",
    label: "Status",
    options: ["Open", "Investigating", "Resolved", "Closed"],
    predicate: (i, v) => i.status === v,
  },
];

export default function IncidentsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Incidents" description={`${INCIDENTS.length} recorded incidents across the fleet.`} />
      <DataTable
        data={INCIDENTS}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by incident number, location..."
        searchFn={(i, q) => [i.incidentNumber, i.location, i.description].some((f) => f.toLowerCase().includes(q))}
      />
    </div>
  );
}
