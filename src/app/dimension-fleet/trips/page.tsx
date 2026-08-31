"use client";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/dimension-fleet/data-table";
import { PageHeader } from "@/components/dimension-fleet/page-header";
import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { fmtDateTime } from "@/lib/dimension-fleet/format";
import { driverName, TRIPS, vehicleLabel } from "@/lib/dimension-fleet/generate";
import type { Trip } from "@/lib/dimension-fleet/types";

const columns: ColumnDef<Trip>[] = [
  {
    key: "trip",
    header: "Trip",
    sortValue: (t) => t.tripNumber,
    cell: (t) => <span className="font-medium">{t.tripNumber}</span>,
  },
  { key: "vehicle", header: "Vehicle", cell: (t) => vehicleLabel(t.vehicleId) },
  { key: "driver", header: "Driver", cell: (t) => driverName(t.driverId) },
  { key: "origin", header: "Origin", sortValue: (t) => t.origin, cell: (t) => t.origin },
  { key: "destination", header: "Destination", sortValue: (t) => t.destination, cell: (t) => t.destination },
  { key: "distance", header: "Distance", sortValue: (t) => t.distanceMiles, cell: (t) => `${t.distanceMiles} mi` },
  { key: "departure", header: "Departure", sortValue: (t) => t.departure, cell: (t) => fmtDateTime(t.departure) },
  { key: "arrival", header: "Arrival", sortValue: (t) => t.arrival, cell: (t) => fmtDateTime(t.arrival) },
  { key: "status", header: "Status", sortValue: (t) => t.status, cell: (t) => <StatusBadge status={t.status} /> },
];

const filters: FilterDef<Trip>[] = [
  {
    key: "status",
    label: "Status",
    options: ["Scheduled", "Dispatched", "In Transit", "Completed", "Cancelled"],
    predicate: (t, v) => t.status === v,
  },
];

export default function TripsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Trips"
        description={`${TRIPS.length} trips scheduled, dispatched, and completed across the fleet.`}
      />
      <DataTable
        data={TRIPS}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by trip number, origin, destination..."
        searchFn={(t, q) => [t.tripNumber, t.origin, t.destination].some((f) => f.toLowerCase().includes(q))}
      />
    </div>
  );
}
