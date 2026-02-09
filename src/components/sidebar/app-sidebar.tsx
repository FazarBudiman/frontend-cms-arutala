"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useAuthenticated } from "@/hooks/use-auth";
import { filterByRole } from "./filter-menu";
import { navContentWebsite, navGeneral } from "./sidebar.config";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuthenticated();
  if (!user) {
    return null;
  }

  const generalMenu = filterByRole(navGeneral, user.role_name);
  const contentWebsiteMenu = filterByRole(navContentWebsite, user.role_name);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                  <Image src="/logo.png" alt="arutala-logo" width={300} height={300} />
                </div>
                <span className="text-base font-semibold">ArutalaLab CMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={generalMenu} labels="General" />
        <NavMain items={contentWebsiteMenu} labels="Content Website" />
      </SidebarContent>
    </Sidebar>
  );
}
