"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { usePathname } from "next/navigation";
import { generateBreadcrumb } from "@/lib/gen-breadcumb";
import React from "react";
import { useAuthenticated } from "@/hooks/use-auth";

export function SiteHeader() {
  const { data: authenticated, isLoading } = useAuthenticated();

  const pathname = usePathname();
  const breadcumbs = generateBreadcrumb(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>{item.label}</BreadcrumbItem>
                {index < breadcumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">{!isLoading && authenticated && <NavUser user={authenticated} />}</div>
      </div>
    </header>
  );
}
