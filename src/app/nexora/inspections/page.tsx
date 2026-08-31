"use client";

import { type ColumnDef, DataTable, type FilterDef } from "@/components/nexora/data-table";
import { PageHeader } from "@/components/nexora/page-header";
import { StatusBadge } from "@/components/nexora/status-badge";
import { fmtDate } from "@/lib/nexora/format";
import { INSPECTIONS, vehicleLabel } from "@/lib/nexora/generate";
import type { Inspection } from "@/lib/nexora/types";

const columns: ColumnDef<Inspection>[] = [
  {
    key: "vehicle",
    header: "Vehicle",
    sortValue: (i) => vehicleLabel(i.vehicleId),
    cell: (i) => vehicleLabel(i.vehicleId),
  },
  { key: "type", header: "Inspection Type", sortValue: (i) => i.inspectionType, cell: (i) => i.inspectionType },
  { key: "date", header: "Date", sortValue: (i) => i.date, cell: (i) => fmtDate(i.date) },
  { key: "inspector", header: "Inspector", sortValue: (i) => i.inspector, cell: (i) => i.inspector },
  { key: "result", header: "Result", sortValue: (i) => i.result, cell: (i) => <StatusBadge status={i.result} /> },
  { key: "status", header: "Status", sortValue: (i) => i.status, cell: (i) => <StatusBadge status={i.status} /> },
];

const filters: FilterDef<Inspection>[] = [
  { key: "result", label: "Result", options: ["Pass", "Pass with Notes", "Fail"], predicate: (i, v) => i.result === v },
  {
    key: "status",
    label: "Status",
    options: ["Completed", "Scheduled", "Overdue"],
    predicate: (i, v) => i.status === v,
  },
];

export default function InspectionsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Inspections" description={`${INSPECTIONS.length} vehicle inspection records.`} />
      <DataTable
        data={INSPECTIONS}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by vehicle, inspector..."
        searchFn={(i, q) =>
          [vehicleLabel(i.vehicleId), i.inspector, i.inspectionType].some((f) => f.toLowerCase().includes(q))
        }
      />
    </div>
  );
}
