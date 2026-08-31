import { Activity, MapPin, Package, Truck } from "lucide-react";

import { PageHeader } from "@/components/nexora/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DELIVERIES, LOCATIONS } from "@/lib/nexora/generate";

export default function LocationsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Locations"
        description="Depots, service centers, and distribution facilities across the network."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LOCATIONS.map((loc) => {
          const utilization = Math.min(100, Math.round((loc.vehicleIds.length / loc.capacity) * 100));
          const deliveries = DELIVERIES.filter((d) => d.destination.startsWith(loc.city)).length;
          return (
            <Card key={loc.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="font-semibold text-sm">{loc.name}</CardTitle>
                  <p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
                    <MapPin className="size-3" /> {loc.city}, {loc.state}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-xs">{loc.type}</span>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-primary" /> {loc.vehicleIds.length} vehicles
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-primary" /> {deliveries} deliveries
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-muted-foreground text-xs">
                    <span>Capacity Utilization</span>
                    <span>
                      {loc.vehicleIds.length}/{loc.capacity}
                    </span>
                  </div>
                  <Progress value={utilization} />
                </div>
                <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Activity className="size-3.5" /> Active facility — 24/7 operations
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
