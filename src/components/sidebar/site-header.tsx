"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { useParams, usePathname } from "next/navigation";
import { generateBreadcrumb } from "@/shared/utils/breadcumb";
import React from "react";
import { useAuthenticated } from "@/features/auth";
import { useCourseDetail } from "@/features/course/hook";
import Link from "next/link";

export function SiteHeader() {
  const { data: authenticated, isLoading } = useAuthenticated();

  const pathname = usePathname();
  const params = useParams();

  const breadcrumbs = generateBreadcrumb(pathname);
  const courseId = params?.courseId as string | undefined;
  const batchId = params?.courseBatchId as string | undefined;

  const isCourseDetail = pathname.startsWith("/content-website/courses/") && courseId;

  const { data: course } = useCourseDetail(courseId ?? "", {
    enabled: !!isCourseDetail,
  });

  const selectedBatch = course?.courseBatch?.find((b) => b.course_batch_id === batchId);

  const finalBreadcrumbs = breadcrumbs.map((item) => {
    // Replace courseId
    if (item.segment === courseId && course?.course_title) {
      return {
        ...item,
        label: course.course_title,
      };
    }

    // Replace batchId
    if (item.segment === batchId && selectedBatch?.name) {
      return {
        ...item,
        label: selectedBatch.name,
      };
    }

    return item;
  });

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {finalBreadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <BreadcrumbItem>{index !== 0 ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}</BreadcrumbItem>
                {index < finalBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">{!isLoading && authenticated && <NavUser user={authenticated} />}</div>
      </div>
    </header>
  );
}
