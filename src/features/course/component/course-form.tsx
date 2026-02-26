/* eslint-disable react-hooks/incompatible-library */
"use client";

import { Button } from "@/components/ui/button";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseInput } from "@/features/course";
import { courseInputSchema } from "@/features/course/type";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCourseCategory, useCourseField, useCourseBenefit } from "@/features/course/hook";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/shared/lib/cn";

interface CourseFormProps {
  initialData?: CourseInput;
  onSubmit: (values: CourseInput) => Promise<void> | void;
  isPending?: boolean;
  submitLabel?: string;
}

export function CourseForm({ initialData, onSubmit, isPending, submitLabel = "Save Course" }: CourseFormProps) {
  const { data: coursescategory } = useCourseCategory();
  const { data: coursesfield } = useCourseField();
  const { data: coursesbenefits } = useCourseBenefit();

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseInputSchema),
    values: initialData,
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategoryId: "",
      courseFieldId: "",
      isDisplayed: true,
      courseBenefits: [],
      courseMaterials: [],
    },
  });

  const selectedBenefitIds = form.watch("courseBenefits")?.map((b) => b.courseBenefitId) ?? [];

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

  const handleFormSubmit = async (values: CourseInput) => {
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

    await onSubmit(formatted);
  };
  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Title */}
        <Controller
          name="courseTitle"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="courseTitle">Title</FieldLabel>
              <Input {...field} id="courseTitle" placeholder="Masukan judul kursus..." aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Category */}
        <Controller
          name="courseCategoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Category</FieldLabel>
              <Select value={initialData?.courseCategoryId || field.value} onValueChange={field.onChange}>
                <SelectTrigger className={cn("md:col-span-1 gap-1", fieldState.invalid && "border-destructive")}>
                  <SelectValue placeholder="Pilih kategori..." />
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
        {/* Field */}
        <Controller
          name="courseFieldId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Field</FieldLabel>
              <Select value={initialData?.courseFieldId || field.value} onValueChange={field.onChange}>
                <SelectTrigger className={cn("md:col-span-1 gap-1", fieldState.invalid && "border-destructive")}>
                  <SelectValue placeholder="Pilih bidang..." />
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
        {/* Status */}
        <Controller
          name="isDisplayed"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-4 gap-1 flex-row items-center justify-between rounded-lg border p-3" data-invalid={fieldState.invalid}>
              <div className="space-y-0.5">
                <FieldLabel>Status Kursus</FieldLabel>
                <div className="text-[0.8rem] text-muted-foreground">Tentukan apakah kursus ini akan ditampilkan atau disembunyikan.</div>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Description */}
        <Controller
          name="courseDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-4 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="courseDescription">Description</FieldLabel>
              <Textarea {...field} id="courseDescription" placeholder="Masukan deskripsi kursus..." aria-invalid={fieldState.invalid} autoComplete="off" className="min-h-20" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Course Benefits */}
        <Controller
          name="courseBenefits"
          control={form.control}
          render={({ fieldState }) => (
            <Field className="md:col-span-2 flex-col" data-invalid={fieldState.invalid}>
              <Card className={cn("w-full", fieldState.invalid && "border-destructive")}>
                <CardHeader>
                  <CardTitle className={cn("text-sm font-medium", fieldState.invalid && "text-destructive")}>Course Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {benefitFields.map((item, index) => (
                    <div key={item.id} className="border rounded-md p-3 space-y-2 bg-muted/30">
                      <Controller
                        name={`courseBenefits.${index}.courseBenefitId`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Benefit - {index + 1}</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih benefit..." />
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
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    disabled={benefitFields.length === coursesbenefits?.length}
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
                    {benefitFields.length === coursesbenefits?.length ? "All Benefits Added" : "Add Benefit"}
                  </Button>
                </CardFooter>
              </Card>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Course Materials */}
        <Controller
          name="courseMaterials"
          control={form.control}
          render={({ fieldState }) => (
            <Field className="md:col-span-2 flex-col" data-invalid={fieldState.invalid}>
              <Card className={cn("w-full", fieldState.invalid && "border-destructive")}>
                <CardHeader>
                  <CardTitle className={cn("text-sm font-medium", fieldState.invalid && "text-destructive")}>Course Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {materialFields.map((item, index) => (
                    <div key={item.id} className="border rounded-md p-3 space-y-2 bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Controller
                          name={`courseMaterials.${index}.title`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Title {index + 1}</FieldLabel>
                              <Input {...field} placeholder="Masukan judul materi..." />
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
                              <Textarea {...field} placeholder="Masukan deskripsi materi..." />
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
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
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
                </CardFooter>
              </Card>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? `${submitLabel}...` : submitLabel}
        </Button>
      </div>
    </form>
  );
}
