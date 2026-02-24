"use client";

import { CourseDetailCard, useCourseDetail } from "@/features/course";
import { useParams } from "next/navigation";
import { SkeletonCourseDetail } from "@/components/skeleton-detail-card";
import { CourseBatchTable } from "@/features/course-batch";
import { useSetBreadcrumbLabel } from "@/providers";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const { data, isLoading, isError, error } = useCourseDetail(courseId);

  useSetBreadcrumbLabel(`/content-website/courses/${courseId}`, data?.course_title);

  if (isLoading) {
    return <SkeletonCourseDetail />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>Course not found</div>;
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
