"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CourseForm } from "@/features/course/component/course-form";
import { useCreateCourse } from "@/features/course/hook";
import { CourseInput } from "@/features/course/type";
import { IconCircleArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateCoursePage() {
  const router = useRouter();
  const { mutateAsync: createCourse, isPending } = useCreateCourse();

  const handleCreate = async (values: CourseInput) => {
    toast.promise(createCourse(values), {
      loading: "Membuat course...",
      success: () => {
        setTimeout(() => {
          router.push("/content-website/courses");
        }, 1000);
        return "Course berhasil dibuat";
      },
      error: (err) => err.message || "Gagal membuat course",
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 space-y-4">
        <div className=" flex items-center gap-3">
          <Button variant="outline" size="icon-sm" onClick={() => router.push("/content-website/courses")}>
            <IconCircleArrowLeft className="size-5" />
          </Button>

          <h6 className="text-lg font-medium">Create Course</h6>
        </div>
        <Separator />
        <CourseForm onSubmit={handleCreate} isPending={isPending} submitLabel="Create Course" />
      </div>
    </div>
  );
}
