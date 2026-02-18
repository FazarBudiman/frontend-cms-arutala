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
import { CourseBatchInput, courseBatchInputSchema, CourseBatchStatus } from "../../type";
import { useContributors } from "@/features/contributor/hook";
import { useCreateCourseBatch } from "../../hook";
import { useParams } from "next/navigation";

// =========================
// DATE FORMAT HELPER
// =========================
function formatDateId(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: localeId });
}

// =========================
// PRICE FORMAT HELPER
// =========================
function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

function parseRupiahInput(raw: string): number {
  const cleaned = raw.replace(/\D/g, "");
  return cleaned === "" ? 0 : parseInt(cleaned, 10);
}

// =========================
// MAIN COMPONENT
// =========================
export default function CourseBatchAddDialog() {
  const [open, setOpen] = useState(false);

  const { data: contributors } = useContributors();
  const { mutateAsync, isPending } = useCreateCourseBatch();
  const params = useParams();
  const courseId = params.courseId as string;
  const courseBatchStatusOptions = Object.values(CourseBatchStatus);

  const form = useForm<CourseBatchInput>({
    resolver: zodResolver(courseBatchInputSchema),
    defaultValues: {
      batchName: "",
      contributorId: "",
      batchStatus: "DRAFT", // Default value
      registrationStart: "",
      registrationEnd: "",
      startDate: "",
      endDate: "",
      batchSession: [
        {
          topic: "",
          sessionDate: "",
          sessionStartTime: "08:00",
          sessionEndTime: "16:00",
        },
      ],
      batchPrice: {
        basePrice: 0,
        // discountType: "NONE",
        // discountValue: 0,
      },
    },
  });

  const {
    fields: sessionFields,
    append: appendSession,
    remove: removeSession,
  } = useFieldArray({
    control: form.control,
    name: "batchSession",
  });

  // Helper to sync DateRange picker with form fields
  const handleDateRangeChange = (range: DateRange | undefined, startField: any, endField: any) => {
    if (range?.from) {
      startField.onChange(format(range.from, "yyyy-MM-dd"));
    } else {
      startField.onChange("");
    }
    if (range?.to) {
      endField.onChange(format(range.to, "yyyy-MM-dd"));
    } else {
      endField.onChange("");
    }
  };

  const getMethods = form.watch();

  const registrationStart = form.watch("registrationStart");
  const registrationEnd = form.watch("registrationEnd");
  const courseStart = form.watch("startDate");
  const courseEnd = form.watch("endDate");
  const discountType = form.watch("batchPrice.discountType");

  const registrationRange = React.useMemo(() => {
    return {
      from: registrationStart ? new Date(registrationStart) : undefined,
      to: registrationEnd ? new Date(registrationEnd) : undefined,
    };
  }, [registrationStart, registrationEnd]);

  const courseRange = React.useMemo(() => {
    return {
      from: courseStart ? new Date(courseStart) : undefined,
      to: courseEnd ? new Date(courseEnd) : undefined,
    };
  }, [courseStart, courseEnd]);

  const handleSubmit = async (values: CourseBatchInput) => {
    // Construct payload
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

    toast.promise(mutateAsync({ courseId, body: payload }), {
      loading: "Membuat course batch...",
      success: () => {
        setOpen(false);
        form.reset();
        return "Course batch berhasil dibuat";
      },
      error: (err) => err.message || "Gagal membuat course batch",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm">Add Batch</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Course Batch</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* ================= BASIC INFO ================= */}
          <div>
            <label className="text-sm font-medium">Batch Name</label>
            <Controller control={form.control} name="batchName" render={({ field }) => <Input {...field} placeholder="Masukkan nama batch" />} />
            {form.formState.errors.batchName && <p className="text-red-500 text-xs">{form.formState.errors.batchName.message}</p>}
          </div>

          {/* Contributor / Instruktur */}
          <div>
            <label className="text-sm font-medium">Instruktur</label>
            <Controller
              control={form.control}
              name="contributorId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Instruktur" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {contributors?.map((contributor) => (
                      <SelectItem key={contributor.contributor_id} value={contributor.contributor_id}>
                        {contributor.contributor_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.contributorId && <p className="text-red-500 text-xs">{form.formState.errors.contributorId.message}</p>}
          </div>

          {/* Batch Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Controller
              control={form.control}
              name="batchStatus"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseBatchStatusOptions.map((status) => (
                      <SelectItem value={status} key={status}>
                        {status.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.batchStatus && <p className="text-red-500 text-xs">{form.formState.errors.batchStatus.message}</p>}
          </div>

          {/* Registration Date Range */}
          <div>
            <label className="text-sm font-medium">Periode Pendaftaran</label>
            <DateRangePicker
              value={registrationRange}
              onChange={(range) => {
                form.setValue("registrationStart", range?.from ? format(range.from, "yyyy-MM-dd") : "");
                form.setValue("registrationEnd", range?.to ? format(range.to, "yyyy-MM-dd") : "");
              }}
            />
            {(form.formState.errors.registrationStart || form.formState.errors.registrationEnd) && <p className="text-red-500 text-xs">Periode pendaftaran harus diisi lengkap</p>}
          </div>

          {/* Course Duration */}
          <div>
            <label className="text-sm font-medium">Durasi Kursus</label>
            <DateRangePicker
              value={courseRange}
              onChange={(range) => {
                form.setValue("startDate", range?.from ? format(range.from, "yyyy-MM-dd") : "");
                form.setValue("endDate", range?.to ? format(range.to, "yyyy-MM-dd") : "");
              }}
            />
            {(form.formState.errors.startDate || form.formState.errors.endDate) && <p className="text-red-500 text-xs">Durasi kursus harus diisi lengkap</p>}
          </div>

          {/* ================= SESSIONS ================= */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Sessions</h3>
              <Button size="sm" type="button" onClick={() => appendSession({ topic: "", sessionDate: "", sessionStartTime: "08:00", sessionEndTime: "16:00" })}>
                <Plus size={16} />
              </Button>
            </div>

            {sessionFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-xl space-y-3">
                <Controller control={form.control} name={`batchSession.${index}.topic`} render={({ field }) => <Input {...field} placeholder="Topik sesi" />} />

                <Controller
                  control={form.control}
                  name={`batchSession.${index}.sessionDate`}
                  render={({ field }) => <SingleDatePicker value={field.value ? new Date(field.value) : undefined} onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} />}
                />

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Mulai</label>
                    <Controller control={form.control} name={`batchSession.${index}.sessionStartTime`} render={({ field }) => <Input type="time" {...field} />} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Selesai</label>
                    <Controller control={form.control} name={`batchSession.${index}.sessionEndTime`} render={({ field }) => <Input type="time" {...field} />} />
                  </div>
                </div>

                {sessionFields.length > 1 && (
                  <Button variant="destructive" size="sm" type="button" onClick={() => removeSession(index)}>
                    <Trash size={14} className="mr-1" />
                    Hapus Sesi
                  </Button>
                )}
              </div>
            ))}
            {form.formState.errors.batchSession && <p className="text-red-500 text-xs">{form.formState.errors.batchSession.root?.message || "Minimal 1 sesi"}</p>}
          </div>

          {/* ================= PRICE ================= */}
          <div className="space-y-4">
            <h3 className="font-semibold">Harga</h3>

            <div>
              <label className="text-sm font-medium">Harga Dasar (Rp)</label>
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
              />
              {form.formState.errors.batchPrice?.basePrice && <p className="text-red-500 text-xs">{form.formState.errors.batchPrice.basePrice.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipe Diskon</label>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Tanpa Diskon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Tanpa Diskon</SelectItem>
                        <SelectItem value="PERCENT">Persen (%)</SelectItem>
                        <SelectItem value="FIXED">Nominal (Rp)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {discountType && discountType !== "NONE" && (
                <div>
                  <label className="text-sm font-medium">{discountType === "PERCENT" ? "Diskon (%)" : "Diskon (Rp)"}</label>
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
                  />
                  {form.formState.errors.batchPrice?.discountValue && <p className="text-red-500 text-xs">{form.formState.errors.batchPrice.discountValue.message}</p>}
                </div>
              )}
            </div>
          </div>

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
              {isPending ? "Creating..." : "Create Course Batch"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================
// REUSABLE DATE RANGE PICKER
// ============================================
function DateRangePicker({ value, onChange }: { value?: DateRange; onChange: (value: DateRange | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (value.to ? `${formatDateId(value.from)} - ${formatDateId(value.to)}` : formatDateId(value.from)) : "Pilih rentang tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="range" locale={localeId} selected={value} onSelect={onChange} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
}

// ============================================
// SINGLE DATE PICKER
// ============================================
function SingleDatePicker({ value, onChange }: { value?: Date; onChange: (date: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value ? formatDateId(value) : "Pilih tanggal"}
          <ChevronDownIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar mode="single" locale={localeId} selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
