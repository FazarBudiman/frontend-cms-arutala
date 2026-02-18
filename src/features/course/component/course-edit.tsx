"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CourseDetail, CourseInput, courseInputSchema } from "../type";
import { useCourseBenefit, useCourseCategory, useCourseField, useUpdateCourse } from "../hook";
import { Trash2 } from "lucide-react";

type CourseEditDialogProps = {
  courseDetail: Partial<CourseDetail>;
};

export function CourseEditDialog({ courseDetail }: CourseEditDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateCourse();
  const { data: coursescategory } = useCourseCategory();
  const { data: coursesfield } = useCourseField();
  const { data: coursesbenefits } = useCourseBenefit();

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseInputSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategoryId: "",
      courseFieldId: "fieldId",
      courseBenefits: [],
      courseMaterials: [],
    },
  });

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control: form.control,
    name: "courseMaterials",
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control: form.control,
    name: "courseBenefits",
  });

  const handleCreate = async (values: CourseInput) => {
    // console.log(values);
    toast.promise(mutateAsync({ courseId: courseDetail.course_id!, body: values }), {
      loading: "Mengubah course...",
      success: () => {
        setOpen(false);
        form.reset();
        return "Mengubah course berhasil";
      },
      error: (err) => err.message || "Gagal mengubah course",
    });
  };

  useEffect(() => {
    if (!coursescategory || !coursesfield || !courseDetail) return;

    const categoryId = coursescategory.find((cat) => cat.name === courseDetail.course_category_name)?.id;

    const fieldId = coursesfield.find((field) => field.field === courseDetail.course_field_name)?.id;

    form.reset({
      courseTitle: courseDetail.course_title ?? "",
      courseDescription: courseDetail.course_description ?? "",
      courseCategoryId: categoryId ?? "",
      courseFieldId: fieldId ?? "",

      courseMaterials:
        courseDetail.courseMaterial?.map((m, index) => ({
          title: m.title,
          description: m.description,
          orderNum: index + 1,
        })) ?? [],

      courseBenefits:
        courseDetail.courseBenefit?.map((b, index) => {
          const benefitId = coursesbenefits?.find((benefit) => benefit.title === b.title)?.id;

          return {
            courseBenefitId: benefitId ?? "",
            orderNum: index + 1,
          };
        }) ?? [],
    });
  }, [coursescategory, coursesfield, coursesbenefits, courseDetail, form]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Course
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {/* <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-6"> */}
        <form onSubmit={form.handleSubmit(handleCreate, (err) => console.log("ERROR:", err))} className="space-y-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Course</AlertDialogTitle>
            <AlertDialogDescription>Isi detail course di bawah ini</AlertDialogDescription>
          </AlertDialogHeader>

          {/* ================= BASIC INFO ================= */}

          <div className="space-y-4">
            <Controller name="courseTitle" control={form.control} render={({ field }) => <Input {...field} placeholder="Course Title" />} />

            <Controller name="courseDescription" control={form.control} render={({ field }) => <textarea {...field} placeholder="Course Description" className="w-full border rounded-md p-2 min-h-25" />} />

            <Controller
              name="courseCategoryId"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursescategory?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="courseFieldId"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesfield?.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* ================= MATERIALS ================= */}

          <div className="space-y-4">
            <h3 className="font-semibold">Course Materials</h3>

            {materialFields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-2">
                <Controller name={`courseMaterials.${index}.title`} control={form.control} render={({ field }) => <Input {...field} placeholder="Title" />} />

                <Controller name={`courseMaterials.${index}.description`} control={form.control} render={({ field }) => <Input {...field} placeholder="Description" />} />

                <Controller name={`courseMaterials.${index}.orderNum`} control={form.control} render={({ field }) => <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />} />

                <Button type="button" variant="destructive" size="sm" onClick={() => removeMaterial(index)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendMaterial({
                  title: "",
                  description: "",
                  orderNum: materialFields.length + 1,
                })
              }
            >
              + Add Material
            </Button>
          </div>

          {/* ================= BENEFITS ================= */}

          <div className="space-y-4">
            <h3 className="font-semibold">Course Benefits</h3>

            {benefitFields.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Controller
                  name={`courseBenefits.${index}.courseBenefitId`}
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Benefit" />
                      </SelectTrigger>
                      <SelectContent>
                        {coursesbenefits?.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller name={`courseBenefits.${index}.orderNum`} control={form.control} render={({ field }) => <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />} />

                <Button type="button" variant="destructive" size="icon" onClick={() => removeBenefit(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendBenefit({
                  courseBenefitId: "",
                  orderNum: benefitFields.length + 1,
                })
              }
            >
              + Add Benefit
            </Button>
          </div>

          {/* ================= FOOTER ================= */}

          <AlertDialogFooter>
            <AlertDialogCancel
              size="sm"
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={isPending} size="sm">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            {/* <Button type="submit">Save Changes</Button> */}
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
