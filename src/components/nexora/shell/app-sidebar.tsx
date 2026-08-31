"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Truck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NEXORA_NAV } from "./nav-items";

export function NexoraSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-3 py-3">
        <Link href="/nexora/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="size-4.5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-sm">NEXORA FLEET</span>
            <span className="text-[10px] text-muted-foreground">Fleet & Logistics Platform</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {NEXORA_NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.url || pathname.startsWith(`${item.url}/`);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
