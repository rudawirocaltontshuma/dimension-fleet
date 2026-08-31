import type { ReactNode } from "react";

import { DimensionFleetSidebar } from "@/components/dimension-fleet/shell/app-sidebar";
import { DimensionFleetTopbar } from "@/components/dimension-fleet/shell/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DimensionFleetLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <DimensionFleetSidebar />
      <SidebarInset className="min-w-0">
        <DimensionFleetTopbar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-5">{children}</main>
      </SidebarInset>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
