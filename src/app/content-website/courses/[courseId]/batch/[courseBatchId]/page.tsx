"use client";

import { CourseBatchDetailCard } from "@/features/course/component/course-batch/course-batch-detail-card";
import { useCourseDetail } from "@/features/course/hook";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const { data, isLoading, isError, error } = useCourseDetail(courseId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>Course not found</div>;
  }
  console.log(data.courseBatch);

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 flex flex-col gap-10">
        <CourseBatchDetailCard courseBatchDetail={data.courseBatch[0]} />
      </div>
    </div>
  );
}
