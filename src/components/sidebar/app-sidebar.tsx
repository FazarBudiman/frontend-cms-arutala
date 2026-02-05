"use client";

import * as React from "react";
import { IconArticle, IconChalkboardTeacher, IconDashboard, IconDeviceImacCode, IconHeartHandshake, IconMessage2, IconMessageCircleUser, IconUserSquareRounded, IconWorldSearch } from "@tabler/icons-react";
import { NavMain } from "@/components/sidebar/nav-main";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGeneral: {
    groupName: "General",
    items: [
      {
        title: "Dashboard",
        url: "/general/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Message",
        url: "/general/messages",
        icon: IconMessage2,
      },
      {
        title: "User",
        url: "/general/users",
        icon: IconUserSquareRounded,
      },
      {
        title: "SEO Management",
        url: "#",
        icon: IconWorldSearch,
      },
    ],
  },
  navContentWebsite: {
    groupName: "Content Website",
    items: [
      {
        title: "Course",
        url: "#",
        icon: IconDeviceImacCode,
      },
      {
        title: "Contributors",
        url: "#",
        icon: IconChalkboardTeacher,
      },
      {
        title: "Mitra",
        url: "#",
        icon: IconHeartHandshake,
      },
      {
        title: "Testimoni",
        url: "#",
        icon: IconMessageCircleUser,
      },
      {
        title: "Article",
        url: "#",
        icon: IconArticle,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navGeneral.items} labels={data.navGeneral.groupName} />
        <NavMain items={data.navContentWebsite.items} labels={data.navContentWebsite.groupName} />
      </SidebarContent>
    </Sidebar>
  );
}
