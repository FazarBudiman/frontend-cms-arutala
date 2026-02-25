"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import * as React from "react";
import { CourseBatchForm } from "@/features/course-batch/component/course-batch-form";
import { useCourseBatch, useUpdateCourseBatch } from "@/features/course-batch/hook";
import { CourseBatchInput, CourseBatchStatus } from "@/features/course-batch/type";
import { useCourseDetail } from "@/features/course/hook";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { IconCircleArrowLeft } from "@tabler/icons-react";

function toDateOnly(isoString: string): string {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

export default function EditCourseBatchPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const courseBatchId = params.courseBatchId as string;

  const { data: courseDetail } = useCourseDetail(courseId);
  const { data: batch, isLoading: isBatchLoading } = useCourseBatch(courseId, courseBatchId);
  const { mutateAsync: updateBatch, isPending: isUpdatePending } = useUpdateCourseBatch();

  const initialData = React.useMemo<CourseBatchInput | undefined>(() => {
    if (!batch) return undefined;

    return {
      batchName: batch.name,
      contributorId: batch.instructor_id ?? "",
      batchStatus: batch.batch_status as CourseBatchStatus,
      registrationStart: toDateOnly(batch.registration_start),
      registrationEnd: toDateOnly(batch.registration_end),
      startDate: toDateOnly(batch.start_date),
      endDate: toDateOnly(batch.end_date),
      batchSession:
        batch.sessions?.map((s) => ({
          topic: s.topic,
          sessionDate: s.date,
          sessionStartTime: s.start_time.slice(0, 5),
          sessionEndTime: s.end_time.slice(0, 5),
        })) ?? [],
      batchPrice: {
        basePrice: batch.base_price,
        discountType: (batch.discount_type === "PERCENT" || batch.discount_type === "FIXED" ? batch.discount_type : undefined) as "PERCENT" | "FIXED" | undefined,
        discountValue: batch.discount_value ?? 0,
        finalPrice: batch.final_price ?? batch.base_price,
      },
    };
  }, [batch]);

  const handleSubmit = async (values: CourseBatchInput) => {
    toast.promise(
      updateBatch({
        courseId,
        batchId: courseBatchId,
        body: values,
      }),
      {
        loading: "Menyimpan perubahan...",
        success: () => {
          router.push(`/content-website/courses/${courseId}/batch/${courseBatchId}`);
          return "Batch berhasil diperbarui";
        },
        error: (err) => err.message || "Gagal memperbarui batch",
      },
    );
  };

  if (isBatchLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 lg:p-8 pt-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
        <Separator />
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 space-y-4">
        {/* Title Page */}

        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <IconCircleArrowLeft className="size-5" />
          </Button>
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-lg font-medium">Edit Batch</h2>
            <p className="text-xs text-muted-foreground">
              Updating <span className="font-semibold text-foreground">{batch?.name}</span> for <span className="font-semibold text-foreground">{courseDetail?.course_title || "..."}</span>
            </p>
          </div>
        </div>
        <Separator />

        <CourseBatchForm initialData={initialData} onSubmit={handleSubmit} isPending={isUpdatePending} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
