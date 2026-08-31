"use client";

import { toast } from "sonner";

import { PageHeader } from "@/components/nexora/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

function saved(section: string) {
  toast.success(`${section} settings saved`, { description: "This is a UI demo — changes are not persisted." });
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Settings"
        description="Manage your profile, notifications, preferences, and fleet configuration."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={() => toast.info("Avatar upload is a UI demo.")}>
                Change Photo
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Full Name</Label>
                <Input defaultValue="Olivia Martinez" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Role</Label>
                <Input defaultValue="Fleet Operations Manager" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Email</Label>
                <Input defaultValue="olivia.martinez@nexorafleet.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Phone</Label>
                <Input defaultValue="(214) 555-0148" />
              </div>
            </div>
            <Button className="w-fit" onClick={() => saved("Profile")}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              ["Maintenance alerts", "Notify when a vehicle is due or overdue for service"],
              ["Incident reports", "Notify when a new incident is logged"],
              ["Delivery delays", "Notify when a delivery is delayed or fails"],
              ["Document expirations", "Notify before licenses, registrations, or insurance expire"],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{title}</p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
                <Switch defaultChecked onCheckedChange={() => toast.success(`${title} preference updated`)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Distance Unit</Label>
              <Select defaultValue="miles" onValueChange={() => toast.success("Preference updated")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="km">Kilometers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Date Format</Label>
              <Select defaultValue="mdy" onValueChange={() => toast.success("Preference updated")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-muted-foreground text-xs">Follows system theme by default</p>
              </div>
              <Switch onCheckedChange={() => toast.success("Theme preference updated")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">Fleet Configuration</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Default Depot</Label>
              <Select defaultValue="loc-main" onValueChange={() => toast.success("Fleet configuration updated")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loc-main">Main Depot</SelectItem>
                  <SelectItem value="loc-north">North Depot</SelectItem>
                  <SelectItem value="loc-south">South Depot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Service Interval (miles)</Label>
              <Input defaultValue="10000" type="number" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Auto-dispatch</p>
                <p className="text-muted-foreground text-xs">Automatically assign drivers to unassigned deliveries</p>
              </div>
              <Switch onCheckedChange={() => toast.success("Fleet configuration updated")} />
            </div>
            <Button className="w-fit" onClick={() => saved("Fleet configuration")}>
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
