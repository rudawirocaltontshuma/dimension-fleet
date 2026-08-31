"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS, ChartCard } from "@/components/nexora/charts/chart-card";
import { PageHeader } from "@/components/nexora/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deliveryPerformanceByMonth,
  deliveryStatusBreakdown,
  driverPerformanceBuckets,
  fleetUtilizationByMonth,
  fuelConsumptionByMonth,
  incidentsBySeverity,
  maintenanceCostByMonth,
  topVehicleTypesByCount,
  tripActivityByMonth,
  tripStatusBreakdown,
  vehicleStatusBreakdown,
} from "@/lib/nexora/aggregate";
import { fmtMoney } from "@/lib/nexora/format";

function Pie2({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Analytics"
        description="Deep-dive analytics across fleet, drivers, trips, deliveries, fuel, and maintenance."
      />

      <Tabs defaultValue="fleet">
        <TabsList className="flex-wrap">
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="driver">Driver</TabsTrigger>
          <TabsTrigger value="trip">Trip</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Fleet Utilization Trend">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fleetUtilizationByMonth()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} width={35} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke={CHART_COLORS[0]}
                  fill={CHART_COLORS[0]}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Vehicle Status Mix">
            <Pie2 data={vehicleStatusBreakdown()} />
          </ChartCard>
          <ChartCard title="Fleet Composition by Type" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVehicleTypesByCount()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="value" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="driver" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Performance Score Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverPerformanceBuckets()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Incidents by Severity">
            <Pie2 data={incidentsBySeverity()} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="trip" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Trip Activity Trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tripActivityByMonth()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Line type="monotone" dataKey="trips" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Trip Status Breakdown">
            <Pie2 data={tripStatusBreakdown()} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="delivery" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Delivery Outcomes by Month" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryPerformanceByMonth()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="delivered" stackId="a" fill={CHART_COLORS[2]} name="Delivered" />
                <Bar dataKey="delayed" stackId="a" fill={CHART_COLORS[3]} name="Delayed" />
                <Bar dataKey="failed" stackId="a" fill={CHART_COLORS[4]} name="Failed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Delivery Status Mix">
            <Pie2 data={deliveryStatusBreakdown()} />
          </ChartCard>
        </TabsContent>

        <TabsContent value="fuel" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Fuel Cost Trend">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelConsumptionByMonth()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip formatter={(v) => fmtMoney(Number(v))} />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke={CHART_COLORS[3]}
                  fill={CHART_COLORS[3]}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Average Efficiency (MPG)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelConsumptionByMonth()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Line type="monotone" dataKey="avgMpg" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Maintenance Cost Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceCostByMonth()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip formatter={(v) => fmtMoney(Number(v))} />
                <Bar dataKey="cost" fill={CHART_COLORS[5]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
