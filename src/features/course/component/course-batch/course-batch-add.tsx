/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { Controller, useFieldArray, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Trash2 } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// import { CourseBatchInput, courseBatchInputSchema, CourseBatchStatus } from "../../type";
// import { useContributors } from "@/features/contributor/hook";
// import { useCreateCourseBatch } from "../../hook";
// import { useParams } from "next/navigation";

// export function CourseBatchAddDialog() {
//   const [open, setOpen] = useState(false);
//   const { data: contributors } = useContributors();
//   const courseBatchStatusOptions = Object.values(CourseBatchStatus);

//   const { mutateAsync, isPending } = useCreateCourseBatch();
//   const params = useParams();
//   const courseId = params.courseId as string;

//   const form = useForm<CourseBatchInput>({
//     resolver: zodResolver(courseBatchInputSchema),
//     defaultValues: {
//       batchName: "",
//       contributorId: "",
//       registrationStart: "",
//       registrationEnd: "",
//       startDate: "",
//       endDate: "",
//       batchStatus: "",
//       batchSession: [],
//       batchPrice: {
//         basePrice: 0,
//       },
//     },
//   });

//   const {
//     fields: sessionFields,
//     append,
//     remove,
//   } = useFieldArray({
//     control: form.control,
//     name: "batchSession",
//   });

//   const handleCreate = async (values: CourseBatchInput) => {
//     console.log(values);
//     toast.promise(mutateAsync({ courseId: courseId, body: values }), {
//       loading: "Membuat course batch....",
//       success: () => {
//         setOpen(false);
//         form.reset();
//         return "Membuat course batch berhasil";
//       },
//       error: (err) => err.message || "Gagal membuat course batch",
//     });

//     // toast.success("Batch berhasil dibuat");
//     // setOpen(false);
//     // form.reset();
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm">Tambah Batch</Button>
//       </DialogTrigger>

//       <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
//         <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-6">
//           <DialogHeader>
//             <DialogTitle>Tambah Course Batch</DialogTitle>
//             <DialogDescription>Isi detail batch di bawah ini</DialogDescription>
//           </DialogHeader>

//           {/* ================= BASIC INFO ================= */}
//           <div className="space-y-4">
//             <Controller name="batchName" control={form.control} render={({ field }) => <Input {...field} placeholder="Batch Name" />} />

//             <Controller
//               name="contributorId"
//               control={form.control}
//               render={({ field }) => (
//                 <Select value={field.value} onValueChange={field.onChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose Instruktur" />
//                   </SelectTrigger>
//                   <SelectContent position="popper">
//                     {contributors?.map((contributor) => (
//                       <SelectItem key={contributor.contributor_id} value={contributor.contributor_id}>
//                         {contributor.contributor_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <Controller name="registrationStart" control={form.control} render={({ field }) => <Input type="date" {...field} />} />
//               <Controller name="registrationEnd" control={form.control} render={({ field }) => <Input type="date" {...field} />} />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Controller name="startDate" control={form.control} render={({ field }) => <Input type="date" {...field} />} />
//               <Controller name="endDate" control={form.control} render={({ field }) => <Input type="date" {...field} />} />
//             </div>

//             <Controller
//               name="batchStatus"
//               control={form.control}
//               render={({ field }) => (
//                 <Select value={field.value} onValueChange={field.onChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {courseBatchStatusOptions.map((status) => (
//                       <SelectItem value={status} key={status}>
//                         {status}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>

//           {/* ================= SESSIONS ================= */}
//           <div className="space-y-4">
//             <h3 className="font-semibold">Batch Sessions</h3>

//             {sessionFields.map((item, index) => (
//               <div key={item.id} className="border p-4 rounded-md space-y-3">
//                 <Controller name={`batchSession.${index}.topic`} control={form.control} render={({ field }) => <Input {...field} placeholder="Topic" />} />

//                 <Controller name={`batchSession.${index}.sessionDate`} control={form.control} render={({ field }) => <Input type="date" {...field} />} />

//                 <div className="grid grid-cols-2 gap-4">
//                   <Controller name={`batchSession.${index}.sessionStartTime`} control={form.control} render={({ field }) => <Input type="time" {...field} />} />
//                   <Controller name={`batchSession.${index}.sessionEndTime`} control={form.control} render={({ field }) => <Input type="time" {...field} />} />
//                 </div>

//                 <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
//                   <Trash2 className="w-4 h-4 mr-1" />
//                   Remove Session
//                 </Button>
//               </div>
//             ))}

//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 append({
//                   topic: "",
//                   sessionDate: "",
//                   sessionStartTime: "",
//                   sessionEndTime: "",
//                 })
//               }
//             >
//               + Add Session
//             </Button>
//           </div>

//           {/* ================= PRICE ================= */}
//           <div className="space-y-4">
//             <h3 className="font-semibold">Batch Price</h3>

//             <Controller name="batchPrice.basePrice" control={form.control} render={({ field }) => <Input type="number" placeholder="Base Price" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />} />
//           </div>

//           {/* ================= FOOTER ================= */}
//           <DialogFooter>
//             <Button type="submit">{isPending ? "Creating" : "Create Batch"}</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { addDays } from "date-fns";
import { CalendarIcon, ChevronDownIcon, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { type DateRange } from "react-day-picker";

type CourseBatchPayload = {
  batchName: string;
  registrationStart: string;
  registrationEnd: string;
  startDate: string;
  endDate: string;
  batchStatus: string;
  batchSession: {
    topic: string;
    sessionDate: string;
    sessionStartTime: string;
    sessionEndTime: string;
  }[];
  batchPrice: {
    basePrice: number;
  };
};

export default function CourseBatchAddDialog() {
  const [open, setOpen] = useState(false);

  // =========================
  // MAIN FORM STATE
  // =========================
  const [batchName, setBatchName] = useState("");
  const [batchStatus, setBatchStatus] = useState("SCHEDULED");
  const [basePrice, setBasePrice] = useState<number>(0);

  const [registrationRange, setRegistrationRange] = useState<DateRange | undefined>();

  const [courseRange, setCourseRange] = useState<DateRange | undefined>();

  const [sessions, setSessions] = useState<
    {
      topic: string;
      sessionDate?: Date;
      sessionStartTime: string;
      sessionEndTime: string;
    }[]
  >([
    {
      topic: "",
      sessionDate: undefined,
      sessionStartTime: "08:00",
      sessionEndTime: "16:00",
    },
  ]);

  // =========================
  // SESSION HANDLER
  // =========================
  const updateSession = (index: number, field: string, value: any) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    setSessions(updated);
  };

  const addSession = () => {
    setSessions([
      ...sessions,
      {
        topic: "",
        sessionDate: undefined,
        sessionStartTime: "08:00",
        sessionEndTime: "16:00",
      },
    ]);
  };

  const removeSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = () => {
    const payload: CourseBatchPayload = {
      batchName,
      registrationStart: registrationRange?.from ? format(registrationRange.from, "yyyy-MM-dd") : "",
      registrationEnd: registrationRange?.to ? format(registrationRange.to, "yyyy-MM-dd") : "",
      startDate: courseRange?.from ? format(courseRange.from, "yyyy-MM-dd") : "",
      endDate: courseRange?.to ? format(courseRange.to, "yyyy-MM-dd") : "",
      batchStatus,
      batchSession: sessions.map((s) => ({
        topic: s.topic,
        sessionDate: s.sessionDate ? format(s.sessionDate, "yyyy-MM-dd") : "",
        sessionStartTime: s.sessionStartTime,
        sessionEndTime: s.sessionEndTime,
      })),
      batchPrice: {
        basePrice,
      },
    };

    console.log("FINAL PAYLOAD:", payload);

    // call API here

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Batch</Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Course Batch</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Batch Name */}
          <div>
            <label className="text-sm font-medium">Batch Name</label>
            <Input value={batchName} onChange={(e) => setBatchName(e.target.value)} />
          </div>

          {/* Registration Date Range */}
          <div>
            <label className="text-sm font-medium">Registration Period</label>
            <DateRangePicker value={registrationRange} onChange={setRegistrationRange} />
          </div>

          {/* Course Duration */}
          <div>
            <label className="text-sm font-medium">Course Duration</label>
            <DateRangePicker value={courseRange} onChange={setCourseRange} />
          </div>

          {/* Sessions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Sessions</h3>
              <Button size="sm" onClick={addSession}>
                <Plus size={16} />
              </Button>
            </div>

            {sessions.map((session, index) => (
              <div key={index} className="border p-4 rounded-xl space-y-3">
                <Input placeholder="Topic" value={session.topic} onChange={(e) => updateSession(index, "topic", e.target.value)} />

                <SingleDatePicker value={session.sessionDate} onChange={(date) => updateSession(index, "sessionDate", date)} />

                <div className="flex gap-4">
                  <Input type="time" value={session.sessionStartTime} onChange={(e) => updateSession(index, "sessionStartTime", e.target.value)} />
                  <Input type="time" value={session.sessionEndTime} onChange={(e) => updateSession(index, "sessionEndTime", e.target.value)} />
                </div>

                <Button variant="destructive" size="sm" onClick={() => removeSession(index)}>
                  <Trash size={14} />
                </Button>
              </div>
            ))}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium">Base Price</label>
            <Input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// REUSABLE RANGE PICKER
// ============================================
function DateRangePicker({ value, onChange }: { value?: DateRange; onChange: (value: DateRange | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (value.to ? `${format(value.from, "PPP")} - ${format(value.to, "PPP")}` : format(value.from, "PPP")) : "Pick date range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={2} />
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
          {value ? format(value, "PPP") : "Select date"}
          <ChevronDownIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
