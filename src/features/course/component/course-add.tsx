"use client";

import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseInput, courseInputSchema } from "../type";
import { useCourseBenefit, useCourseCategory, useCourseField, useCreateCourse } from "../hook";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CourseAddDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateCourse();
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

  const handleCreate = async (values: CourseInput) => {
    const formatted = {
      ...values,
      courseMaterials: values.courseMaterials.map((m, index) => ({
        ...m,
        orderNum: index + 1,
      })),
      courseBenefits: values.courseBenefits.map((b, index) => ({
        ...b,
        orderNum: index + 1,
      })),
    };

    toast.promise(mutateAsync(formatted), {
      loading: "Membuat course...",
      success: () => {
        setOpen(false);
        form.reset();
        return "Course berhasil dibuat";
      },
      error: (err) => err.message || "Gagal membuat course",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">
          Tambah Course <PlusCircle />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit max-w-4xl!">
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Course</AlertDialogTitle>
          <AlertDialogDescription>Isi detail course di bawah ini</AlertDialogDescription>
        </AlertDialogHeader>

        {/* ================= BASIC INFO ================= */}
        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
          <ScrollArea className="h-96 px-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 -mx-4 max-h-max overflow-y-auto px-4">
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

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Field>
                    <FieldLabel>Course Benefits</FieldLabel>
                  </Field>

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
                    <PlusCircle />
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
                                ?.filter((b) => {
                                  // Jangan tampilkan yang sudah dipilih,
                                  // kecuali milik index sekarang
                                  return !selectedBenefitIds.includes(b.id) || b.id === field.value;
                                })
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

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Field>
                    <FieldLabel>Course Materials</FieldLabel>
                  </Field>

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
                    <PlusCircle />
                    Add Material
                  </Button>
                </div>

                {materialFields.map((item, index) => (
                  <div key={item.id} className="border rounded-md p-2 space-y-2 bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Title */}
                      <Controller
                        name={`courseMaterials.${index}.title`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Title {index + 1}</FieldLabel>
                            <Input {...field} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      {/* Description */}
                      <Controller
                        name={`courseMaterials.${index}.description`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                            <FieldLabel>Description {index + 1}</FieldLabel>
                            <Textarea {...field} />
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
              {isPending ? "Creating..." : "Create Course"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
