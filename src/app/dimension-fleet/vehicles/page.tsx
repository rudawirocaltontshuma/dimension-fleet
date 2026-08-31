"use client";

import Link from "next/link";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/dimension-fleet/data-table";
import { PageHeader } from "@/components/dimension-fleet/page-header";
import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { fmtDate } from "@/lib/dimension-fleet/format";
import { driverName, locationName, VEHICLES } from "@/lib/dimension-fleet/generate";
import type { Vehicle } from "@/lib/dimension-fleet/types";

const columns: ColumnDef<Vehicle>[] = [
  {
    key: "vehicle",
    header: "Vehicle",
    sortValue: (v) => v.fleetNumber,
    cell: (v) => (
      <Link href={`/dimension-fleet/vehicles/${v.id}`} className="font-medium hover:underline">
        <div>{v.fleetNumber}</div>
        <div className="font-normal text-muted-foreground text-xs">
          {v.year} {v.make} {v.model}
        </div>
      </Link>
    ),
  },
  { key: "plate", header: "Registration", sortValue: (v) => v.plate, cell: (v) => v.plate },
  { key: "type", header: "Type", sortValue: (v) => v.type, cell: (v) => v.type },
  { key: "driver", header: "Driver", cell: (v) => driverName(v.driverId) },
  { key: "location", header: "Location", cell: (v) => locationName(v.locationId) },
  { key: "mileage", header: "Mileage", sortValue: (v) => v.mileage, cell: (v) => `${v.mileage.toLocaleString()} mi` },
  { key: "fuel", header: "Fuel", sortValue: (v) => v.fuelLevel, cell: (v) => `${v.fuelLevel}%` },
  { key: "status", header: "Status", sortValue: (v) => v.status, cell: (v) => <StatusBadge status={v.status} /> },
  {
    key: "lastService",
    header: "Last Service",
    sortValue: (v) => v.lastServiceDate,
    cell: (v) => fmtDate(v.lastServiceDate),
  },
];

const filters: FilterDef<Vehicle>[] = [
  {
    key: "status",
    label: "Status",
    options: ["Available", "On Trip", "Maintenance", "Inactive"],
    predicate: (v, val) => v.status === val,
  },
  {
    key: "type",
    label: "Type",
    options: [...new Set(VEHICLES.map((v) => v.type))],
    predicate: (v, val) => v.type === val,
  },
];

export default function VehiclesPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Vehicles" description={`Manage the ${VEHICLES.length}-vehicle fleet directory.`} />
      <DataTable
        data={VEHICLES}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by fleet number, VIN, plate..."
        searchFn={(v, q) => [v.fleetNumber, v.vin, v.plate, v.make, v.model].some((f) => f.toLowerCase().includes(q))}
      />
    </div>
  );
}
