import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  FileBarChart,
  FileText,
  Fuel,
  Gauge,
  KanbanSquare,
  LayoutDashboard,
  type LucideIcon,
  MapPin,
  MapPinned,
  Package,
  Settings,
  ShieldAlert,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

export interface DimensionFleetNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface DimensionFleetNavGroup {
  label: string;
  items: DimensionFleetNavItem[];
}

export const DIMENSION_FLEET_NAV: DimensionFleetNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dimension-fleet/dashboard", icon: LayoutDashboard },
      { title: "Fleet", url: "/dimension-fleet/fleet", icon: Boxes },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Vehicles", url: "/dimension-fleet/vehicles", icon: Truck },
      { title: "Drivers", url: "/dimension-fleet/drivers", icon: Users },
      { title: "Trips", url: "/dimension-fleet/trips", icon: MapPinned },
      { title: "Routes", url: "/dimension-fleet/routes", icon: MapPin },
      { title: "Deliveries", url: "/dimension-fleet/deliveries", icon: Package },
      { title: "Dispatch", url: "/dimension-fleet/dispatch", icon: KanbanSquare },
    ],
  },
  {
    label: "Maintenance & Safety",
    items: [
      { title: "Maintenance", url: "/dimension-fleet/maintenance", icon: Wrench },
      { title: "Fuel", url: "/dimension-fleet/fuel", icon: Fuel },
      { title: "Incidents", url: "/dimension-fleet/incidents", icon: ShieldAlert },
      { title: "Inspections", url: "/dimension-fleet/inspections", icon: ClipboardCheck },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Locations", url: "/dimension-fleet/locations", icon: Gauge },
      { title: "Documents", url: "/dimension-fleet/documents", icon: FileText },
      { title: "Reports", url: "/dimension-fleet/reports", icon: FileBarChart },
      { title: "Analytics", url: "/dimension-fleet/analytics", icon: BarChart3 },
      { title: "Settings", url: "/dimension-fleet/settings", icon: Settings },
    ],
  },
];
