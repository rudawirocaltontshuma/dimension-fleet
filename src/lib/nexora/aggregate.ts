import { TODAY_ISO } from "./constants";
import { DELIVERIES, DRIVERS, FUEL_RECORDS, INCIDENTS, MAINTENANCE_RECORDS, TRIPS, VEHICLES } from "./generate";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function lastNMonthsLabels(n: number) {
  const ref = new Date(TODAY_ISO);
  const out: { key: string; label: string; year: number; month: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTHS[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return out;
}

export function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function vehicleStatusBreakdown() {
  const counts: Record<string, number> = {};
  for (const v of VEHICLES) counts[v.status] = (counts[v.status] ?? 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function tripActivityByMonth() {
  const months = lastNMonthsLabels(6);
  return months.map((m) => ({
    month: m.label,
    trips: TRIPS.filter((t) => monthKey(t.departure) === m.key).length,
  }));
}

export function deliveryPerformanceByMonth() {
  const months = lastNMonthsLabels(6);
  return months.map((m) => {
    const dels = DELIVERIES.filter((d) => monthKey(d.scheduled) === m.key);
    const delivered = dels.filter((d) => d.status === "Delivered").length;
    return {
      month: m.label,
      delivered,
      delayed: dels.filter((d) => d.status === "Delayed").length,
      failed: dels.filter((d) => d.status === "Failed").length,
      onTimeRate: dels.length ? Math.round((delivered / dels.length) * 100) : 0,
    };
  });
}

export function fuelConsumptionByMonth() {
  const months = lastNMonthsLabels(6);
  return months.map((m) => {
    const recs = FUEL_RECORDS.filter((f) => monthKey(f.date) === m.key);
    return {
      month: m.label,
      gallons: Math.round(recs.reduce((s, r) => s + r.volumeGallons, 0)),
      cost: Math.round(recs.reduce((s, r) => s + r.cost, 0)),
      avgMpg: recs.length ? Math.round((recs.reduce((s, r) => s + r.efficiencyMpg, 0) / recs.length) * 10) / 10 : 0,
    };
  });
}

export function maintenanceCostByMonth() {
  const months = lastNMonthsLabels(6);
  return months.map((m) => ({
    month: m.label,
    cost: Math.round(MAINTENANCE_RECORDS.filter((r) => monthKey(r.date) === m.key).reduce((s, r) => s + r.cost, 0)),
  }));
}

export function fleetUtilizationByMonth() {
  const months = lastNMonthsLabels(6);
  const total = VEHICLES.length;
  return months.map((m, i) => {
    // approximate utilization from trips in that month relative to fleet size
    const tripCount = TRIPS.filter((t) => monthKey(t.departure) === m.key).length;
    const utilization = Math.min(100, Math.round((tripCount / total) * 55 + 35 + (i % 3) * 2));
    return { month: m.label, utilization };
  });
}

export function incidentsBySeverity() {
  const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  for (const inc of INCIDENTS) counts[inc.severity] = (counts[inc.severity] ?? 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function driverPerformanceBuckets() {
  const buckets = { "90-100": 0, "80-89": 0, "70-79": 0, "Below 70": 0 };
  for (const d of DRIVERS) {
    if (d.performanceScore >= 90) buckets["90-100"]++;
    else if (d.performanceScore >= 80) buckets["80-89"]++;
    else if (d.performanceScore >= 70) buckets["70-79"]++;
    else buckets["Below 70"]++;
  }
  return Object.entries(buckets).map(([name, value]) => ({ name, value }));
}

export function tripStatusBreakdown() {
  const counts: Record<string, number> = {};
  for (const t of TRIPS) counts[t.status] = (counts[t.status] ?? 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function deliveryStatusBreakdown() {
  const counts: Record<string, number> = {};
  for (const d of DELIVERIES) counts[d.status] = (counts[d.status] ?? 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function topVehicleTypesByCount() {
  const counts: Record<string, number> = {};
  for (const v of VEHICLES) counts[v.type] = (counts[v.type] ?? 0) + 1;
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
