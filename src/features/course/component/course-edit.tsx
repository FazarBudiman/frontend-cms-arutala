/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseDetail, CourseInput, courseInputSchema } from "../type";
import { useCourseBenefit, useCourseCategory, useCourseField, useUpdateCourse } from "../hook";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { EntityDialog } from "@/components/shared/entity-dialog";

type CourseEditDialogProps = {
  courseDetail: Partial<CourseDetail>;
};

export function CourseEditDialog({ courseDetail }: CourseEditDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateCourse, isPending } = useUpdateCourse();
  const { data: coursescategory } = useCourseCategory();
  const { data: coursesfield } = useCourseField();
  const { data: coursesbenefits } = useCourseBenefit();

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseInputSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategoryId: "",
      courseFieldId: "",
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

  const selectedBenefitIds = form.watch("courseBenefits")?.map((b) => b.courseBenefitId) ?? [];

  const handleUpdate = async (values: CourseInput) => {
    toast.promise(updateCourse({ courseId: courseDetail.course_id!, body: values }), {
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
    if (!coursescategory || !coursesfield || !courseDetail || !open) return;

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
  }, [coursescategory, coursesfield, coursesbenefits, courseDetail, form, open]);

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Edit Course"
      description="Isi detail course di bawah ini"
      isPending={isPending}
      saveLabel="Save Changes"
      onSubmit={form.handleSubmit(handleUpdate)}
      className="max-w-4xl!"
      trigger={
        <Button size="sm" variant="outline">
          Edit Course <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      }
    >
      <div className="md:col-span-2">
        <ScrollArea className="h-[50vh] pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">
            <Controller
              name="courseTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="courseTitle">Title</FieldLabel>
                  <Input {...field} id="courseTitle" aria-invalid={fieldState.invalid} autoComplete="off" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="courseDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="courseDescription">Description</FieldLabel>
                  <Textarea {...field} id="courseDescription" aria-invalid={fieldState.invalid} autoComplete="off" className="min-h-20" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="courseCategoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {coursescategory?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="courseFieldId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel>Field</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Field" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {coursesfield?.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="md:col-span-2 space-y-2 pt-2 border-t mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Course Benefits</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appendBenefit({
                      courseBenefitId: "",
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Benefit
                </Button>
              </div>

              {benefitFields.map((item, index) => (
                <div key={item.id} className="border rounded-md p-2 space-y-2 bg-muted/30">
                  <Controller
                    name={`courseBenefits.${index}.courseBenefitId`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Benefit {index + 1}</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Benefit" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {coursesbenefits
                              ?.filter((b) => !selectedBenefitIds.includes(b.id) || b.id === field.value)
                              .map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                  {b.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeBenefit(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-2 space-y-2 pt-2 border-t mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Course Materials</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appendMaterial({
                      title: "",
                      description: "",
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </div>

              {materialFields.map((item, index) => (
                <div key={item.id} className="border rounded-md p-2 space-y-2 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Controller
                      name={`courseMaterials.${index}.title`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Title {index + 1}</FieldLabel>
                          <Input {...field} placeholder="Material title" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name={`courseMaterials.${index}.description`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                          <FieldLabel>Description {index + 1}</FieldLabel>
                          <Textarea {...field} placeholder="Material description" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeMaterial(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </EntityDialog>
  );
}
