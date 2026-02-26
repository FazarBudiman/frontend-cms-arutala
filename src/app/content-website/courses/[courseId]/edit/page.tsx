"use client";

import { use, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { CourseForm } from "@/features/course/component/course-form";
import { useCourseDetail, useUpdateCourse, useCourseCategory, useCourseField, useCourseBenefit } from "@/features/course/hook";
import { CourseInput } from "@/features/course/type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IconCircleArrowLeft } from "@tabler/icons-react";

export default function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();

  const { data: course, isLoading: isCourseLoading } = useCourseDetail(courseId);
  const { mutateAsync: updateCourse, isPending: isUpdatePending } = useUpdateCourse();

  // Load master data for mapping
  const { data: categories } = useCourseCategory();
  const { data: fields } = useCourseField();
  const { data: benefitsMaster } = useCourseBenefit();

  const initialData = useMemo<CourseInput | undefined>(() => {
    if (!course || !categories || !fields || !benefitsMaster) return undefined;

    const categoryId = categories.find((cat) => cat.name === course.course_category_name)?.id;
    const fieldId = fields.find((f) => f.field === course.course_field_name)?.id;

    return {
      courseTitle: course.course_title,
      courseDescription: course.course_description,
      courseCategoryId: categoryId ?? "",
      courseFieldId: fieldId ?? "",
      isDisplayed: course.is_displayed,
      courseBenefits:
        course.courseBenefit?.map((b) => {
          const benefitId = benefitsMaster.find((bm) => bm.title === b.title)?.id;
          return {
            courseBenefitId: benefitId ?? "",
          };
        }) ?? [],
      courseMaterials:
        course.courseMaterial?.map((m) => ({
          title: m.title,
          description: m.description,
        })) ?? [],
    };
  }, [course, categories, fields, benefitsMaster]);

  const handleUpdate = async (values: CourseInput) => {
    toast.promise(updateCourse({ courseId, body: values }), {
      loading: "Mengubah course...",
      success: () => {
        setTimeout(() => {
          router.push(`/content-website/courses/${courseId}`);
        }, 1000);
        return "Course berhasil diubah";
      },
      error: (err) => err.message || "Gagal mengubah course",
    });
  };

  if (isCourseLoading) {
    return (
      <div className="p-4 lg:px-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Separator />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 space-y-4">
        <div className=" flex items-center gap-3">
          <Button variant="outline" size="icon-sm" onClick={() => router.back()}>
            <IconCircleArrowLeft className="size-5" />
          </Button>

          <h6 className="text-lg font-medium">Edit Course</h6>
        </div>
        <Separator />
        {initialData && <CourseForm onSubmit={handleUpdate} initialData={initialData} isPending={isUpdatePending} submitLabel="Update Course" />}
      </div>
    </div>
  );
}
