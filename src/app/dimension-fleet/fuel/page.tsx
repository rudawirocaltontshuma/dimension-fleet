"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CHART_COLORS, ChartCard } from "@/components/dimension-fleet/charts/chart-card";
import { type ColumnDef, DataTable } from "@/components/dimension-fleet/data-table";
import { PageHeader } from "@/components/dimension-fleet/page-header";
import { fuelConsumptionByMonth } from "@/lib/dimension-fleet/aggregate";
import { fmtDate, fmtMoney2 } from "@/lib/dimension-fleet/format";
import { FUEL_RECORDS, vehicleLabel } from "@/lib/dimension-fleet/generate";
import type { FuelRecord } from "@/lib/dimension-fleet/types";

const columns: ColumnDef<FuelRecord>[] = [
  {
    key: "vehicle",
    header: "Vehicle",
    sortValue: (f) => vehicleLabel(f.vehicleId),
    cell: (f) => vehicleLabel(f.vehicleId),
  },
  { key: "date", header: "Date", sortValue: (f) => f.date, cell: (f) => fmtDate(f.date) },
  { key: "volume", header: "Fuel Volume", sortValue: (f) => f.volumeGallons, cell: (f) => `${f.volumeGallons} gal` },
  { key: "cost", header: "Cost", sortValue: (f) => f.cost, cell: (f) => fmtMoney2(f.cost) },
  { key: "mileage", header: "Mileage", sortValue: (f) => f.mileage, cell: (f) => `${f.mileage.toLocaleString()} mi` },
  { key: "efficiency", header: "Efficiency", sortValue: (f) => f.efficiencyMpg, cell: (f) => `${f.efficiencyMpg} mpg` },
];

export default function FuelPage() {
  const data = fuelConsumptionByMonth();
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Fuel" description={`${FUEL_RECORDS.length} fuel purchase records across the fleet.`} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Fuel Consumption" description="Monthly gallons consumed">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
              <Tooltip />
              <Bar dataKey="gallons" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name="Gallons" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Fuel Cost" description="Monthly fuel spend">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={50}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip formatter={(v) => fmtMoney2(Number(v))} />
              <Bar dataKey="cost" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Efficiency Trend" description="Average MPG over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgMpg"
                stroke={CHART_COLORS[2]}
                strokeWidth={2}
                dot={false}
                name="Avg MPG"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <DataTable
        data={FUEL_RECORDS}
        columns={columns}
        searchPlaceholder="Search by vehicle..."
        searchFn={(f, q) => vehicleLabel(f.vehicleId).toLowerCase().includes(q)}
      />
    </div>
  );
}
