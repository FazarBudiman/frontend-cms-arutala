/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import { format } from "date-fns";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RangeDatePicker, SingleDatePicker } from "@/components/shared/date-picker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useContributors } from "@/features/contributor";
import { CourseBatchInput, courseBatchInputSchema, CourseBatchStatus } from "../type";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";
import { StatusColorCoursebatch } from "./columns";
import { cn } from "@/shared/lib/cn";

// ================= PRICE HELPER =================
function formatRupiah(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "";
  return new Intl.NumberFormat("id-ID").format(value);
}

function parseRupiahInput(raw: string): number | undefined {
  const cleaned = raw.replace(/\D/g, "");
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? undefined : parsed;
}

function calculateFinalPrice(basePrice: number, discountType?: "PERCENT" | "FIXED", discountValue?: number): number {
  const safeBasePrice = basePrice || 0;
  const safeDiscountValue = discountValue || 0;

  if (!discountType || safeDiscountValue === 0) return safeBasePrice;

  if (discountType === "PERCENT") {
    return Math.max(0, safeBasePrice - (safeBasePrice * safeDiscountValue) / 100);
  }

  if (discountType === "FIXED") {
    return Math.max(0, safeBasePrice - safeDiscountValue);
  }

  return safeBasePrice;
}

interface CourseBatchFormProps {
  initialData?: CourseBatchInput;
  onSubmit: (values: CourseBatchInput) => Promise<void> | void;
  isPending?: boolean;
  submitLabel?: string;
}

export function CourseBatchForm({ initialData, onSubmit, isPending, submitLabel = "Save Batch" }: CourseBatchFormProps) {
  const { data: contributors } = useContributors();

  const form = useForm<CourseBatchInput>({
    resolver: zodResolver(courseBatchInputSchema),
    values: initialData || {
      batchName: "",
      contributorId: "",
      batchStatus: "",
      registrationStart: "",
      registrationEnd: "",
      startDate: "",
      endDate: "",
      batchSession: [
        {
          topic: "",
          sessionDate: "",
          sessionStartTime: "",
          sessionEndTime: "",
        },
      ],
      batchPrice: {
        basePrice: 0,
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

  const basePrice = form.watch("batchPrice.basePrice");
  const discountType = form.watch("batchPrice.discountType");
  const discountValue = form.watch("batchPrice.discountValue");

  const finalPrice = React.useMemo(() => {
    return calculateFinalPrice(basePrice, discountType, discountValue);
  }, [basePrice, discountType, discountValue]);

  React.useEffect(() => {
    form.setValue("batchPrice.finalPrice", finalPrice);
  }, [finalPrice, form]);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Batch Name */}
        <Controller
          name="batchName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Batch Name</FieldLabel>
              <Input {...field} placeholder="Batch name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Contributor */}
        <Controller
          name="contributorId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-1 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Instruktur</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={fieldState.invalid ? "border-destructive" : ""}>
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
                <SelectTrigger className={fieldState.invalid ? "border-destructive" : ""}>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Object.values(CourseBatchStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      <Badge className={StatusColorCoursebatch[status]}>{formatSnakeCaseToTitle(status)}</Badge>
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
            <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
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

        {/* Start Period */}
        <Controller
          name="startDate"
          control={form.control}
          render={({ fieldState }) => (
            <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
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

        {/* Sessions */}
        <Controller
          name="batchSession"
          control={form.control}
          render={({ fieldState }) => (
            <Field className="md:col-span-2 flex-col" data-invalid={fieldState.invalid}>
              <Card className={cn("w-full", fieldState.invalid && "border-destructive")}>
                <CardHeader>
                  <CardTitle className={cn("text-sm font-medium", fieldState.invalid && "text-destructive")}>Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sessionFields.map((session, index) => (
                    <div key={session.id} className="border rounded-md p-3 space-y-2 bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Controller
                          name={`batchSession.${index}.topic`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Topic - {index + 1}</FieldLabel>
                              <Input {...field} placeholder="Enter topic" aria-invalid={fieldState.invalid} />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />

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

                        <Controller
                          name={`batchSession.${index}.sessionStartTime`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Mulai</FieldLabel>
                              <Input type="time" {...field} aria-invalid={fieldState.invalid} />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`batchSession.${index}.sessionEndTime`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Selesai</FieldLabel>
                              <Input type="time" {...field} aria-invalid={fieldState.invalid} />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />

                        <div className="md:col-span-2 flex justify-end">
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeSession(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      appendSession({
                        topic: "",
                        sessionDate: "",
                        sessionStartTime: "",
                        sessionEndTime: "",
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Session
                  </Button>
                </CardFooter>
              </Card>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Pricing */}
        <Controller
          name="batchPrice"
          control={form.control}
          render={({ fieldState }) => (
            <Field className="md:col-span-2 flex-col" data-invalid={fieldState.invalid}>
              <Card className={cn("w-full h-full", fieldState.invalid && "border-destructive")}>
                <CardHeader>
                  <CardTitle className={cn("text-sm font-medium", fieldState.invalid && "text-destructive")}>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Controller
                    name="batchPrice.basePrice"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Harga Dasar (Rp)</FieldLabel>
                        <Input
                          inputMode="numeric"
                          placeholder="0"
                          value={field.value === undefined || field.value === null ? "" : field.value === 0 ? "0" : formatRupiah(field.value)}
                          onChange={(e) => field.onChange(parseRupiahInput(e.target.value))}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
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
                            <SelectTrigger className={fieldState.invalid ? "border-destructive" : ""}>
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

                    {discountType && (
                      <Controller
                        name="batchPrice.discountValue"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>{discountType === "PERCENT" ? "Diskon (%)" : "Diskon (Rp)"}</FieldLabel>
                            <Input
                              inputMode="numeric"
                              placeholder="0"
                              value={
                                discountType === "PERCENT"
                                  ? field.value?.toString() || ""
                                  : field.value === undefined || field.value === null
                                    ? ""
                                    : field.value === 0
                                      ? "0"
                                      : formatRupiah(field.value)
                              }
                              onChange={(e) => {
                                const raw = e.target.value;
                                if (discountType === "PERCENT") {
                                  const cleaned = raw.replace(/\D/g, "");
                                  const val = cleaned === "" ? 0 : parseInt(cleaned, 10);
                                  field.onChange(Math.min(isNaN(val) ? 0 : val, 100));
                                } else {
                                  field.onChange(parseRupiahInput(raw));
                                }
                              }}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    )}
                  </div>

                  <div className="p-4 bg-muted/20 border rounded-md">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Estimated Final Price</p>
                    <p className="text-xl font-bold">Rp {formatRupiah(finalPrice)}</p>
                  </div>
                </CardContent>
              </Card>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end ">
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? `${submitLabel}...` : submitLabel}
        </Button>
      </div>
    </form>
  );
}
