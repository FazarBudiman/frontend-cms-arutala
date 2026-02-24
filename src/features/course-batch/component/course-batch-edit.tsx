"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RangeDatePicker, SingleDatePicker } from "@/components/date-picker";

import { useParams } from "next/navigation";
import { useContributors } from "@/features/contributor";
import { useUpdateCourseBatch } from "../hook";
import { CourseBatch, CourseBatchInput, courseBatchInputSchema, CourseBatchStatus } from "../type";

/* ================= PRICE HELPERS ================= */

function toDateOnly(isoString: string): string {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

function parseRupiahInput(raw: string): number | undefined {
  const cleaned = raw.replace(/\D/g, "");
  return cleaned === "" ? undefined : parseInt(cleaned, 10);
}

function calculateFinalPrice(basePrice: number, discountType?: "PERCENT" | "FIXED", discountValue?: number): number {
  if (!basePrice) return 0;
  if (!discountType || !discountValue) return basePrice;

  if (discountType === "PERCENT") {
    return Math.max(0, basePrice - (basePrice * discountValue) / 100);
  }

  if (discountType === "FIXED") {
    return Math.max(0, basePrice - discountValue);
  }

  return basePrice;
}

/* ================= COMPONENT ================= */

export default function CourseBatchEditDialog({ batch }: { batch: CourseBatch }) {
  const [open, setOpen] = useState(false);

  const { data: contributors } = useContributors();
  const { mutateAsync, isPending } = useUpdateCourseBatch();
  const params = useParams();
  const courseId = params.courseId as string;

  const form = useForm<CourseBatchInput>({
    resolver: zodResolver(courseBatchInputSchema),
    defaultValues: {
      batchName: "",
      contributorId: "",
      batchStatus: "DRAFT",
      registrationStart: "",
      registrationEnd: "",
      startDate: "",
      endDate: "",
      batchSession: [],
      batchPrice: {
        basePrice: 0,
        discountType: undefined,
        discountValue: 0,
        finalPrice: 0,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "batchSession",
  });

  /* ================= LOAD DATA ================= */

  React.useEffect(() => {
    if (open && batch && contributors) {
      form.reset({
        batchName: batch.name,
        contributorId: batch.instructor_id ?? "",
        batchStatus: batch.batch_status,
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
          discountType: batch.discount_type as "PERCENT" | "FIXED" | undefined,
          discountValue: batch.discount_value ?? 0,
          finalPrice: batch.final_price ?? batch.base_price,
        },
      });
    }
  }, [open, batch, contributors, form]);

  /* ================= PRICE WATCH ================= */

  const basePrice = form.watch("batchPrice.basePrice");
  const discountType = form.watch("batchPrice.discountType");
  const discountValue = form.watch("batchPrice.discountValue");

  const finalPrice = React.useMemo(() => {
    return calculateFinalPrice(basePrice, discountType, discountValue);
  }, [basePrice, discountType, discountValue]);

  React.useEffect(() => {
    form.setValue("batchPrice.finalPrice", finalPrice);
  }, [finalPrice, form]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (values: CourseBatchInput) => {
    toast.promise(
      mutateAsync({
        courseId,
        batchId: batch.course_batch_id,
        body: values,
      }),
      {
        loading: "Menyimpan perubahan...",
        success: () => {
          setOpen(false);
          return "Batch berhasil diperbarui";
        },
        error: (err) => err.message || "Gagal memperbarui batch",
      },
    );
  };

  /* ================= RENDER ================= */

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">Edit Batch</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-3xl max-w-4xl!">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Course Batch</AlertDialogTitle>
          <AlertDialogDescription>Perbarui detail batch</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <ScrollArea className="h-96 p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Batch Name */}
              <Controller
                name="batchName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel>Batch Name</FieldLabel>
                    <Input {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Instruktur */}
              <Controller
                name="contributorId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel>Instruktur</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Instruktur" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {contributors?.map((c) => (
                          <SelectItem key={c.contributor_id} value={c.contributor_id}>
                            {c.contributor_name}
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
                name="batchStatus"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CourseBatchStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Registration Period */}
              <Controller
                name="registrationStart"
                control={form.control}
                render={({ fieldState }) => (
                  <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel>Periode Pendaftaran</FieldLabel>
                    <RangeDatePicker
                      value={{
                        from: form.watch("registrationStart") ? new Date(form.watch("registrationStart")) : undefined,
                        to: form.watch("registrationEnd") ? new Date(form.watch("registrationEnd")) : undefined,
                      }}
                      onChange={(range) => {
                        form.setValue("registrationStart", range?.from ? format(range.from, "yyyy-MM-dd") : "");
                        form.setValue("registrationEnd", range?.to ? format(range.to, "yyyy-MM-dd") : "");
                      }}
                    />
                    {(form.formState.errors.registrationStart || form.formState.errors.registrationEnd) && <FieldError errors={[{ message: "Periode pendaftaran harus lengkap" }]} />}
                  </Field>
                )}
              />

              {/* Course Period */}
              <Controller
                name="startDate"
                control={form.control}
                render={({ fieldState }) => (
                  <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel>Periode Pelaksanaan</FieldLabel>
                    <RangeDatePicker
                      value={{
                        from: form.watch("startDate") ? new Date(form.watch("startDate")) : undefined,
                        to: form.watch("endDate") ? new Date(form.watch("endDate")) : undefined,
                      }}
                      onChange={(range) => {
                        form.setValue("startDate", range?.from ? format(range.from, "yyyy-MM-dd") : "");
                        form.setValue("endDate", range?.to ? format(range.to, "yyyy-MM-dd") : "");
                      }}
                    />
                    {(form.formState.errors.startDate || form.formState.errors.endDate) && <FieldError errors={[{ message: "Durasi kursus harus lengkap" }]} />}
                  </Field>
                )}
              />

              {/* ================= SESSIONS ================= */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Field>
                    <FieldLabel>Sessions</FieldLabel>
                  </Field>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      append({
                        topic: "",
                        sessionDate: "",
                        sessionStartTime: "08:00",
                        sessionEndTime: "12:00",
                      })
                    }
                  >
                    <PlusCircle />
                    Add Session
                  </Button>
                </div>

                {fields.map((item, index) => (
                  <div key={item.id} className="border rounded-md p-3 space-y-3 bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Topic */}
                      <Controller
                        name={`batchSession.${index}.topic`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Topic {index + 1}</FieldLabel>
                            <Input {...field} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      {/* Session Date */}
                      <Controller
                        name={`batchSession.${index}.sessionDate`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Tanggal</FieldLabel>
                            <SingleDatePicker value={field.value ? new Date(field.value) : undefined} onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      {/* Start Time */}
                      <Controller
                        name={`batchSession.${index}.sessionStartTime`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Mulai</FieldLabel>
                            <Input type="time" {...field} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      {/* End Time */}
                      <Controller
                        name={`batchSession.${index}.sessionEndTime`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Selesai</FieldLabel>
                            <Input type="time" {...field} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ================= PRICE ================= */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t">
                <Field>
                  <FieldLabel>Harga</FieldLabel>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Base Price */}
                  <Controller
                    name="batchPrice.basePrice"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="md:col-span-1" data-invalid={fieldState.invalid}>
                        <FieldLabel>Harga Dasar (Rp)</FieldLabel>
                        <Input inputMode="numeric" placeholder="0" value={field.value === 0 ? "" : formatRupiah(field.value)} onChange={(e) => field.onChange(parseRupiahInput(e.target.value))} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Discount Type */}
                  <Controller
                    name="batchPrice.discountType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Tipe Diskon</FieldLabel>
                        <Select
                          value={field.value || "NONE"}
                          onValueChange={(val) => {
                            if (val === "NONE") {
                              form.setValue("batchPrice.discountType", undefined);
                              form.setValue("batchPrice.discountValue", 0);
                            } else {
                              field.onChange(val);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tanpa Diskon" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="NONE">Tanpa Diskon</SelectItem>
                            <SelectItem value="PERCENT">Persen (%)</SelectItem>
                            <SelectItem value="FIXED">Nominal (Rp)</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Discount Value */}
                  {discountType && (
                    <Controller
                      name="batchPrice.discountValue"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>{discountType === "PERCENT" ? "Diskon (%)" : "Diskon (Rp)"}</FieldLabel>
                          <Input
                            inputMode="numeric"
                            placeholder="0"
                            value={discountType === "PERCENT" ? field.value || "" : field.value === 0 ? "" : formatRupiah(field.value!)}
                            onChange={(e) => {
                              const raw = e.target.value;

                              if (discountType === "PERCENT") {
                                const cleaned = raw.replace(/\D/g, "");
                                field.onChange(Math.min(parseInt(cleaned || "0"), 100));
                              } else {
                                field.onChange(parseRupiahInput(raw));
                              }
                            }}
                          />
                        </Field>
                      )}
                    />
                  )}

                  {/* Final Price */}
                  {discountType && (
                    <Field className="md:col-span-1">
                      <FieldLabel>Harga Akhir</FieldLabel>
                      <Input disabled value={formatRupiah(finalPrice)} />
                    </Field>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Cancel
            </AlertDialogCancel>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
