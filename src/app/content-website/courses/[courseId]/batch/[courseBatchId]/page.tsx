"use client";

import { useParams } from "next/navigation";
import { SkeletonBatchDetail } from "@/components/skeleton-detail-card";
import { useCourseBatch, CourseBatchDetailCard } from "@/features/course-batch";
import { useSetBreadcrumbLabel } from "@/providers";
import { useCourseDetail } from "@/features/course";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const courseBatchId = params.courseBatchId as string;

  const { data: coursesbatch, isLoading, isError, error } = useCourseBatch(courseId, courseBatchId);
  const { data: courseDetail } = useCourseDetail(courseId);

  useSetBreadcrumbLabel(`/content-website/courses/${courseId}`, courseDetail?.course_title);
  useSetBreadcrumbLabel(`/content-website/courses/${courseId}/batch/${courseBatchId}`, coursesbatch?.name);

  if (isLoading) {
    return <SkeletonBatchDetail />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!coursesbatch) {
    return <div>Course not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 flex flex-col gap-10">
        <CourseBatchDetailCard courseBatchDetail={coursesbatch} />
      </div>
    </div>
  );
}
