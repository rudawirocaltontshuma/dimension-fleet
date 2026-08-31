"use client";

import { toast } from "sonner";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/nexora/data-table";
import { PageHeader } from "@/components/nexora/page-header";
import { StatusBadge } from "@/components/nexora/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/nexora/format";
import { DELIVERIES, driverName, routeById } from "@/lib/nexora/generate";
import type { Delivery, DeliveryStatus } from "@/lib/nexora/types";

const STATUSES: DeliveryStatus[] = ["Scheduled", "Dispatched", "In Transit", "Delivered", "Delayed", "Failed"];

const columns: ColumnDef<Delivery>[] = [
  {
    key: "delivery",
    header: "Delivery",
    sortValue: (d) => d.deliveryNumber,
    cell: (d) => <span className="font-medium">{d.deliveryNumber}</span>,
  },
  { key: "customer", header: "Customer", sortValue: (d) => d.customer, cell: (d) => d.customer },
  { key: "route", header: "Route", cell: (d) => routeById.get(d.routeId)?.routeCode ?? "—" },
  { key: "driver", header: "Driver", cell: (d) => driverName(d.driverId) },
  { key: "scheduled", header: "Scheduled", sortValue: (d) => d.scheduled, cell: (d) => fmtDate(d.scheduled) },
  { key: "destination", header: "Destination", sortValue: (d) => d.destination, cell: (d) => d.destination },
  {
    key: "status",
    header: "Status",
    sortValue: (d) => d.status,
    cell: (d) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-1.5 has-[>svg]:px-1.5">
            <StatusBadge status={d.status} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {STATUSES.map((s) => (
            <DropdownMenuItem key={s} onSelect={() => toast.success(`${d.deliveryNumber} marked as ${s}`)}>
              {s}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const filters: FilterDef<Delivery>[] = [
  { key: "status", label: "Status", options: STATUSES, predicate: (d, v) => d.status === v },
];

export default function DeliveriesPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Deliveries" description={`${DELIVERIES.length} deliveries tracked across active routes.`} />
      <DataTable
        data={DELIVERIES}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by delivery number, customer..."
        searchFn={(d, q) => [d.deliveryNumber, d.customer, d.destination].some((f) => f.toLowerCase().includes(q))}
        pageSize={12}
      />
    </div>
  );
}
