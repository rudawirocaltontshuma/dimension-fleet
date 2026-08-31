import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, Mail, Phone, ShieldCheck, TrendingUp, Truck } from "lucide-react";

import { StatusBadge } from "@/components/nexora/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate, initials } from "@/lib/nexora/format";
import { DELIVERIES, driverById, INCIDENTS, TRIPS, vehicleLabel } from "@/lib/nexora/generate";

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = driverById.get(id);
  if (!driver) notFound();

  const trips = TRIPS.filter((t) => t.driverId === id);
  const deliveries = DELIVERIES.filter((d) => d.driverId === id);
  const incidents = INCIDENTS.filter((i) => i.driverId === id);

  const activity = [
    ...trips.map((t) => ({ date: t.departure, label: `Trip ${t.tripNumber}: ${t.origin} → ${t.destination}` })),
    ...deliveries.map((d) => ({ date: d.scheduled, label: `Delivery ${d.deliveryNumber} to ${d.customer}` })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/nexora/drivers"
        className="flex w-fit items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to Drivers
      </Link>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback>{initials(driver.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xl tracking-tight sm:text-2xl">{driver.name}</h1>
            <p className="text-muted-foreground text-sm">
              {driver.driverCode} • {driver.licenseClass}
            </p>
          </div>
        </div>
        <StatusBadge status={driver.status} className="text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="gap-2 py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <Truck className="size-4.5 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Vehicle</p>
              <p className="font-semibold text-sm">{vehicleLabel(driver.vehicleId)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-2 py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <TrendingUp className="size-4.5 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Trips Completed</p>
              <p className="font-semibold text-sm">{driver.tripsCompleted}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-2 py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <ShieldCheck className="size-4.5 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Safety Score</p>
              <p className="font-semibold text-sm">{driver.safetyScore}/100</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-2 py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <TrendingUp className="size-4.5 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Performance</p>
              <p className="font-semibold text-sm">{driver.performanceScore}/100</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-medium text-sm">Driver Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" /> {driver.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" /> {driver.phone}
              </div>
              <div>
                <p className="text-muted-foreground text-xs">License Number</p>
                <p className="font-medium">{driver.licenseNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">License Expiry</p>
                <p className="font-medium">{fmtDate(driver.licenseExpiry)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Hire Date</p>
                <p className="font-medium">{fmtDate(driver.hireDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Deliveries Completed</p>
                <p className="font-medium">{driver.deliveriesCompleted}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="mt-4">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.tripNumber}</TableCell>
                    <TableCell>{t.origin}</TableCell>
                    <TableCell>{t.destination}</TableCell>
                    <TableCell>{fmtDate(t.departure)}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span>Performance Score</span>
                  <span>{driver.performanceScore}/100</span>
                </div>
                <Progress value={driver.performanceScore} />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span>On-Time Delivery Rate</span>
                  <span>{Math.min(99, driver.performanceScore + 3)}%</span>
                </div>
                <Progress value={Math.min(99, driver.performanceScore + 3)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span>Safety Score</span>
                  <span>{driver.safetyScore}/100</span>
                </div>
                <Progress value={driver.safetyScore} />
              </div>
              <p className="text-muted-foreground text-sm">
                {incidents.length} recorded incident(s) associated with this driver.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-sm">
                      No incidents on record.
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.incidentNumber}</TableCell>
                      <TableCell>{fmtDate(i.date)}</TableCell>
                      <TableCell>{i.location}</TableCell>
                      <TableCell>
                        <StatusBadge status={i.severity} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={i.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              {activity.slice(0, 25).map((a, i) => (
                <div key={i} className="flex items-start gap-3 border-l-2 pl-3">
                  <div>
                    <p className="text-sm">{a.label}</p>
                    <p className="text-muted-foreground text-xs">{fmtDate(a.date)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
