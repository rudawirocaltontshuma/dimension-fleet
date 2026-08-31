import type React from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, Calendar, Fuel, Gauge, MapPin, User } from "lucide-react";

import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate, fmtMoney2 } from "@/lib/dimension-fleet/format";
import {
  DOCUMENTS,
  driverName,
  FUEL_RECORDS,
  INCIDENTS,
  INSPECTIONS,
  locationName,
  MAINTENANCE_RECORDS,
  TRIPS,
  vehicleById,
} from "@/lib/dimension-fleet/generate";

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = vehicleById.get(id);
  if (!vehicle) notFound();

  const trips = TRIPS.filter((t) => t.vehicleId === id);
  const maintenance = MAINTENANCE_RECORDS.filter((m) => m.vehicleId === id);
  const fuel = FUEL_RECORDS.filter((f) => f.vehicleId === id);
  const inspections = INSPECTIONS.filter((i) => i.vehicleId === id);
  const incidents = INCIDENTS.filter((i) => i.vehicleId === id);
  const documents = DOCUMENTS.filter((d) => d.relatedId === id || d.relatedLabel === vehicle.fleetNumber);

  type TimelineEvent = { date: string; label: string; type: string };
  const timeline: TimelineEvent[] = [
    ...trips.map((t) => ({
      date: t.departure,
      label: `Trip ${t.tripNumber}: ${t.origin} → ${t.destination}`,
      type: "Trip",
    })),
    ...maintenance.map((m) => ({ date: m.date, label: `${m.maintenanceType} (${m.status})`, type: "Maintenance" })),
    ...fuel.map((f) => ({ date: f.date, label: `Refueled ${f.volumeGallons} gal`, type: "Fuel" })),
    ...inspections.map((i) => ({ date: i.date, label: `${i.inspectionType} — ${i.result}`, type: "Inspection" })),
    ...incidents.map((i) => ({ date: i.date, label: `Incident: ${i.description}`, type: "Incident" })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/dimension-fleet/vehicles"
        className="flex w-fit items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to Vehicles
      </Link>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-semibold text-xl tracking-tight sm:text-2xl">
            {vehicle.fleetNumber} — {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            VIN {vehicle.vin} • Plate {vehicle.plate}
          </p>
        </div>
        <StatusBadge status={vehicle.status} className="text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <InfoTile icon={User} label="Driver" value={driverName(vehicle.driverId)} />
        <InfoTile icon={MapPin} label="Location" value={locationName(vehicle.locationId)} />
        <InfoTile icon={Gauge} label="Mileage" value={`${vehicle.mileage.toLocaleString()} mi`} />
        <InfoTile icon={Fuel} label="Fuel Level" value={`${vehicle.fuelLevel}%`} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-medium text-sm">Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Type" value={vehicle.type} />
              <Detail label="Capacity" value={`${vehicle.capacityTons} tons`} />
              <Detail label="Purchase Date" value={fmtDate(vehicle.purchaseDate)} />
              <Detail label="Last Service" value={fmtDate(vehicle.lastServiceDate)} />
              <Detail label="Next Service Due" value={`${vehicle.nextServiceDueMileage.toLocaleString()} mi`} />
              <Detail label="Home Depot" value={locationName(vehicle.locationId)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="mt-4">
          <SimpleTable
            headers={["Trip", "Origin", "Destination", "Distance", "Departure", "Status"]}
            rows={trips.map((t) => [
              t.tripNumber,
              t.origin,
              t.destination,
              `${t.distanceMiles} mi`,
              fmtDate(t.departure),
              <StatusBadge key={t.id} status={t.status} />,
            ])}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <SimpleTable
            headers={["Type", "Date", "Mileage", "Cost", "Status"]}
            rows={maintenance.map((m) => [
              m.maintenanceType,
              fmtDate(m.date),
              `${m.mileage.toLocaleString()} mi`,
              fmtMoney2(m.cost),
              <StatusBadge key={m.id} status={m.status} />,
            ])}
          />
        </TabsContent>

        <TabsContent value="fuel" className="mt-4">
          <SimpleTable
            headers={["Date", "Volume", "Cost", "Mileage", "Efficiency"]}
            rows={fuel.map((f) => [
              fmtDate(f.date),
              `${f.volumeGallons} gal`,
              fmtMoney2(f.cost),
              `${f.mileage.toLocaleString()} mi`,
              `${f.efficiencyMpg} mpg`,
            ])}
          />
        </TabsContent>

        <TabsContent value="inspections" className="mt-4">
          <SimpleTable
            headers={["Type", "Date", "Inspector", "Result", "Status"]}
            rows={inspections.map((i) => [
              i.inspectionType,
              fmtDate(i.date),
              i.inspector,
              i.result,
              <StatusBadge key={i.id} status={i.status} />,
            ])}
          />
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <SimpleTable
            headers={["Incident", "Date", "Location", "Severity", "Status"]}
            rows={incidents.map((i) => [
              i.incidentNumber,
              fmtDate(i.date),
              i.location,
              <StatusBadge key={`${i.id}s`} status={i.severity} />,
              <StatusBadge key={i.id} status={i.status} />,
            ])}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <SimpleTable
            headers={["Document", "Category", "Issued", "Expires", "Status"]}
            rows={documents.map((d) => [
              d.name,
              d.category,
              fmtDate(d.issueDate),
              fmtDate(d.expiryDate),
              <StatusBadge key={d.id} status={d.status} />,
            ])}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              {timeline.slice(0, 30).map((e, i) => (
                <div key={i} className="flex items-start gap-3 border-l-2 pl-3">
                  <Calendar className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{e.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {fmtDate(e.date)} • {e.type}
                    </p>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && <p className="text-muted-foreground text-sm">No history recorded.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex items-center gap-3 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="font-semibold text-sm">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h) => (
              <TableHead key={h} className="whitespace-nowrap">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headers.length} className="py-8 text-center text-muted-foreground text-sm">
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j} className="whitespace-nowrap">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
