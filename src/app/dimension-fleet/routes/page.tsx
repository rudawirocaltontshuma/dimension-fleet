"use client";

import { useMemo, useState } from "react";

import { Clock, MapPin, Route as RouteIcon, Truck, User } from "lucide-react";

import { PageHeader } from "@/components/dimension-fleet/page-header";
import { RouteMap } from "@/components/dimension-fleet/route-map";
import { StatusBadge } from "@/components/dimension-fleet/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { driverName, ROUTES, vehicleLabel } from "@/lib/dimension-fleet/generate";

export default function RoutesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return ROUTES.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        r.routeCode.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q)
      );
    });
  }, [query, status]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Routes" description={`${ROUTES.length} planned and active routes across the network.`} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by route code, origin, destination..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-1.5 font-medium text-sm">
                <RouteIcon className="size-4 text-primary" /> {r.routeCode}
              </CardTitle>
              <StatusBadge status={r.status} />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <RouteMap origin={r.origin} destination={r.destination} stops={r.stops} status={r.status} />
              <div className="grid grid-cols-2 gap-2 text-muted-foreground text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {r.distanceMiles} mi
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {r.durationHours} hrs
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <User className="size-3.5 shrink-0" /> {driverName(r.driverId)}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Truck className="size-3.5 shrink-0" /> {vehicleLabel(r.vehicleId)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-muted-foreground text-sm">No routes match your filters.</p>
        )}
      </div>
    </div>
  );
}
