"use client";

import { CourseDetailCard, useCourseDetail } from "@/features/course";
import { useParams } from "next/navigation";
import { CourseBatchTable } from "@/features/course-batch";
import { useSetBreadcrumbLabel } from "@/providers";
import { SkeletonDetailCard } from "@/components/shared/skeleton-detail-card";
import { IconDeviceImacCode } from "@tabler/icons-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function CourseDetailPage() {
  const params = useParams();

  const courseId = params.courseId as string;

  const { data, isLoading, isError, error } = useCourseDetail(courseId);

  useSetBreadcrumbLabel(`/content-website/courses/${courseId}`, data?.course_title);

  if (isLoading) {
    return <SkeletonDetailCard />;
  }

  if (isError) {
    <EmptyState title="Error" description={(error as Error).message} icon={<IconDeviceImacCode />} />;
  }

  if (!data) {
    return <EmptyState title="No Seo" description="No messages received yet" icon={<IconDeviceImacCode />} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 flex flex-col gap-10">
        <CourseDetailCard courseDetail={data} />
        <CourseBatchTable batch={data.courseBatch} courseId={courseId} />
      </div>
    </div>
  );
}
