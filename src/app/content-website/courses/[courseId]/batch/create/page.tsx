"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { CourseBatchForm } from "@/features/course-batch/component/course-batch-form";
import { useCreateCourseBatch } from "@/features/course-batch/hook";
import { CourseBatchInput } from "@/features/course-batch/type";
import { useCourseDetail } from "@/features/course/hook";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconCircleArrowLeft } from "@tabler/icons-react";

export default function CreateCourseBatchPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const { data: courseDetail } = useCourseDetail(courseId);
  const { mutateAsync: createBatch, isPending } = useCreateCourseBatch();

  const handleSubmit = async (values: CourseBatchInput) => {
    toast.promise(createBatch({ courseId, body: values }), {
      loading: "Membuat course batch...",
      success: () => {
        router.push(`/content-website/courses/${courseId}`);
        return "Course batch berhasil dibuat";
      },
      error: (err) => err.message || "Gagal membuat course batch",
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 space-y-4">
        {/* Title Page */}
        <div className=" flex items-start gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <IconCircleArrowLeft className="size-5" />
          </Button>
          <div className="flex flex-col items-start gap-1">
            <h6 className="text-lg font-medium">Create Batch</h6>
            <p className="text-xs text-muted-foreground">
              Adding new batch for <span className="font-semibold text-foreground">{courseDetail?.course_title || "..."}</span>
            </p>
          </div>
        </div>
        <Separator />

        {/* Form */}
        <CourseBatchForm onSubmit={handleSubmit} isPending={isPending} submitLabel="Create Batch" />
      </div>
    </div>
  );
}
