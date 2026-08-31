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

export interface NexoraNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NexoraNavGroup {
  label: string;
  items: NexoraNavItem[];
}

export const NEXORA_NAV: NexoraNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/nexora/dashboard", icon: LayoutDashboard },
      { title: "Fleet", url: "/nexora/fleet", icon: Boxes },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Vehicles", url: "/nexora/vehicles", icon: Truck },
      { title: "Drivers", url: "/nexora/drivers", icon: Users },
      { title: "Trips", url: "/nexora/trips", icon: MapPinned },
      { title: "Routes", url: "/nexora/routes", icon: MapPin },
      { title: "Deliveries", url: "/nexora/deliveries", icon: Package },
      { title: "Dispatch", url: "/nexora/dispatch", icon: KanbanSquare },
    ],
  },
  {
    label: "Maintenance & Safety",
    items: [
      { title: "Maintenance", url: "/nexora/maintenance", icon: Wrench },
      { title: "Fuel", url: "/nexora/fuel", icon: Fuel },
      { title: "Incidents", url: "/nexora/incidents", icon: ShieldAlert },
      { title: "Inspections", url: "/nexora/inspections", icon: ClipboardCheck },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Locations", url: "/nexora/locations", icon: Gauge },
      { title: "Documents", url: "/nexora/documents", icon: FileText },
      { title: "Reports", url: "/nexora/reports", icon: FileBarChart },
      { title: "Analytics", url: "/nexora/analytics", icon: BarChart3 },
      { title: "Settings", url: "/nexora/settings", icon: Settings },
    ],
  },
];
