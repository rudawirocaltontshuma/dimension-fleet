"use client";

import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DimensionFleetTopbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search vehicles, drivers, trips..."
          className="h-8 pl-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") toast.info("Search is a UI demo in this build.");
          }}
        />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex size-8 items-center justify-center rounded-md hover:bg-accent">
            <Bell className="size-4.5" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="font-medium text-sm">Vehicle FL-0032 overdue for service</span>
              <span className="text-muted-foreground text-xs">2 hours ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="font-medium text-sm">Delivery DEL-00214 delayed</span>
              <span className="text-muted-foreground text-xs">5 hours ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="font-medium text-sm">New incident reported in Chicago, IL</span>
              <span className="text-muted-foreground text-xs">Yesterday</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 hover:bg-accent">
            <Avatar className="size-7">
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-medium text-sm">Olivia Martinez</span>
              <span className="font-normal text-muted-foreground text-xs">Fleet Operations Manager</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast.info("Profile is a UI demo in this build.")}>
              <User /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.info("Opening settings.")} asChild>
              <a href="/dimension-fleet/settings">
                <Settings /> Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast.info("This is a demo — sign out is disabled.")}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
