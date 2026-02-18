/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type DateRange } from "react-day-picker";
import { CourseBatch, CourseBatchInput, courseBatchInputSchema, CourseBatchStatus } from "../../type";
import { useContributors } from "@/features/contributor/hook";
import { useUpdateCourseBatch } from "../../hook";
import { useParams } from "next/navigation";

// =========================
// HELPERS
// =========================

function formatDateId(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: localeId });
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

function parseRupiahInput(raw: string): number {
  const cleaned = raw.replace(/\D/g, "");
  return cleaned === "" ? 0 : parseInt(cleaned, 10);
}

function normalizeTime(time?: string) {
  return time ? time.slice(0, 5) : "";
}

// =========================
// MAIN COMPONENT
// =========================

export default function CourseBatchEditDialog({ batch }: { batch: CourseBatch }) {
  const [open, setOpen] = useState(false);

  const { data: contributors } = useContributors();
  const { mutateAsync, isPending } = useUpdateCourseBatch();
  const params = useParams();
  const courseId = params.courseId as string;

  const courseBatchStatusOptions = Object.values(CourseBatchStatus);

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
        discountType: "NONE",
        discountValue: 0,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "batchSession",
  });

  const discountType = form.watch("batchPrice.discountType");

  // =========================
  // LOAD INITIAL DATA
  // =========================

  React.useEffect(() => {
    // console.log("batch", batch);
    if (open && batch && contributors) {
      const mapped: CourseBatchInput = {
        batchName: batch.name,
        contributorId: batch.instructor_id ?? "",
        batchStatus: batch.batch_status,
        registrationStart: batch.registration_start,
        registrationEnd: batch.registration_end,
        startDate: batch.start_date,
        endDate: batch.end_date,
        batchSession:
          batch.sessions?.map((s) => ({
            topic: s.topic,
            sessionDate: s.date,
            sessionStartTime: normalizeTime(s.start_time),
            sessionEndTime: normalizeTime(s.end_time),
          })) ?? [],
        batchPrice: {
          basePrice: batch.base_price,
          discountType: batch.discount_type ?? "NONE",
          discountValue: batch.discount_value ?? 0,
        },
      };

      form.reset(mapped);
    }
  }, [open, batch, contributors, form]);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (values: CourseBatchInput) => {
    const payload = { ...values };

    if (payload.batchPrice.discountType === "NONE") {
      const { discountType, discountValue, ...rest } = payload.batchPrice;
      payload.batchPrice = rest;
    } else {
      let finalPrice = payload.batchPrice.basePrice;

      if (payload.batchPrice.discountType === "PERCENT") {
        finalPrice = payload.batchPrice.basePrice - (payload.batchPrice.basePrice * (payload.batchPrice.discountValue || 0)) / 100;
      }

      if (payload.batchPrice.discountType === "FIXED") {
        finalPrice = payload.batchPrice.basePrice - (payload.batchPrice.discountValue || 0);
      }

      (payload.batchPrice as any).finalPrice = Math.max(0, finalPrice);
    }
    console.log("payload edit Course Batch", payload);

    toast.promise(
      mutateAsync({
        courseId,
        batchId: batch.course_batch_id,
        body: payload,
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

  // =========================
  // RENDER
  // =========================

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Batch
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Course Batch</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* BATCH NAME */}
          <Controller control={form.control} name="batchName" render={({ field }) => <Input {...field} placeholder="Nama batch" />} />
          {/* INSTRUKTUR */}
          <Controller
            control={form.control}
            name="contributorId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Instruktur" />
                </SelectTrigger>
                <SelectContent>
                  {contributors?.map((c) => (
                    <SelectItem key={c.contributor_id} value={c.contributor_id}>
                      {c.contributor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* STATUS */}
          <Controller
            control={form.control}
            name="batchStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courseBatchStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* SESSIONS */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Sessions</h3>
              <Button
                size="sm"
                type="button"
                onClick={() =>
                  append({
                    topic: "",
                    sessionDate: "",
                    sessionStartTime: "08:00",
                    sessionEndTime: "16:00",
                  })
                }
              >
                <Plus size={16} />
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-xl space-y-3">
                <Controller control={form.control} name={`batchSession.${index}.topic`} render={({ field }) => <Input {...field} placeholder="Topik sesi" />} />

                <div className="flex gap-4">
                  <Controller control={form.control} name={`batchSession.${index}.sessionStartTime`} render={({ field }) => <Input type="time" {...field} />} />
                  <Controller control={form.control} name={`batchSession.${index}.sessionEndTime`} render={({ field }) => <Input type="time" {...field} />} />
                </div>

                {fields.length > 1 && (
                  <Button variant="destructive" size="sm" type="button" onClick={() => remove(index)}>
                    <Trash size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {/* ================= PRICE ================= */}{" "}
          <div className="space-y-4">
            {" "}
            <h3 className="font-semibold">Harga</h3>{" "}
            <div>
              {" "}
              <label className="text-sm font-medium">Harga Dasar (Rp)</label>{" "}
              <Controller
                control={form.control}
                name="batchPrice.basePrice"
                render={({ field }) => (
                  <Input
                    inputMode="numeric"
                    placeholder="0"
                    value={field.value === 0 ? "" : formatRupiah(field.value)}
                    onChange={(e) => {
                      const val = parseRupiahInput(e.target.value);
                      field.onChange(val);
                    }}
                  />
                )}
              />{" "}
              {form.formState.errors.batchPrice?.basePrice && <p className="text-red-500 text-xs">{form.formState.errors.batchPrice.basePrice.message}</p>}{" "}
            </div>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="text-sm font-medium">Tipe Diskon</label>{" "}
                <Controller
                  control={form.control}
                  name="batchPrice.discountType"
                  render={({ field }) => (
                    <Select
                      value={field.value || "NONE"}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("batchPrice.discountValue", 0);
                      }}
                    >
                      {" "}
                      <SelectTrigger>
                        {" "}
                        <SelectValue placeholder="Tanpa Diskon" />{" "}
                      </SelectTrigger>{" "}
                      <SelectContent>
                        {" "}
                        <SelectItem value="NONE">Tanpa Diskon</SelectItem> <SelectItem value="PERCENT">Persen (%)</SelectItem> <SelectItem value="FIXED">Nominal (Rp)</SelectItem>{" "}
                      </SelectContent>{" "}
                    </Select>
                  )}
                />{" "}
              </div>{" "}
              {discountType && discountType !== "NONE" && (
                <div>
                  {" "}
                  <label className="text-sm font-medium"> {discountType === "PERCENT" ? "Diskon (%)" : "Diskon (Rp)"} </label>{" "}
                  <Controller
                    control={form.control}
                    name="batchPrice.discountValue"
                    render={({ field }) => (
                      <Input
                        inputMode="numeric"
                        placeholder="0"
                        value={discountType === "PERCENT" ? (field.value === 0 ? "" : String(field.value)) : field.value === 0 ? "" : formatRupiah(field.value || 0)}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (discountType === "PERCENT") {
                            const cleaned = raw.replace(/\D/g, "");
                            const num = cleaned === "" ? 0 : Math.min(parseInt(cleaned, 10), 100);
                            field.onChange(num);
                          } else {
                            field.onChange(parseRupiahInput(raw));
                          }
                        }}
                      />
                    )}
                  />{" "}
                  {form.formState.errors.batchPrice?.discountValue && <p className="text-red-500 text-xs">{form.formState.errors.batchPrice.discountValue.message}</p>}{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>
          {/* PRICE
                    <Controller
                        control={form.control}
                        name="batchPrice.basePrice"
                        render={({ field }) => (
                            <Input
                                inputMode="numeric"
                                placeholder="Harga dasar"
                                value={field.value === 0 ? "" : formatRupiah(field.value)}
                                onChange={(e) =>
                                    field.onChange(parseRupiahInput(e.target.value))
                                }
                            />
                        )}
                    />

                    {discountType !== "NONE" && (
                        <Controller
                            control={form.control}
                            name="batchPrice.discountValue"
                            render={({ field }) => (
                                <Input
                                    inputMode="numeric"
                                    placeholder="Diskon"
                                    value={
                                        discountType === "PERCENTAGE"
                                            ? field.value || ""
                                            : field.value === 0
                                                ? ""
                                                : formatRupiah(field.value)
                                    }
                                    onChange={(e) => {
                                        if (discountType === "PERCENTAGE") {
                                            const cleaned = e.target.value.replace(/\D/g, "");
                                            field.onChange(
                                                cleaned === ""
                                                    ? 0
                                                    : Math.min(parseInt(cleaned, 10), 100)
                                            );
                                        } else {
                                            field.onChange(parseRupiahInput(e.target.value));
                                        }
                                    }}
                                />
                            )}
                        />
                    )} */}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
