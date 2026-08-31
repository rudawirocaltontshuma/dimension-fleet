import type { ReactNode } from "react";

import { NexoraSidebar } from "@/components/nexora/shell/app-sidebar";
import { NexoraTopbar } from "@/components/nexora/shell/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function NexoraLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <NexoraSidebar />
      <SidebarInset className="min-w-0">
        <NexoraTopbar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-5">{children}</main>
      </SidebarInset>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
