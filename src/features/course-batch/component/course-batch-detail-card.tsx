import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatedDate } from "@/shared/utils/date";
import Image from "next/image";
import { CourseBatch } from "../type";
import { CourseBatchUpload } from "./course-batch-upload";
import CourseBatchEditDialog from "./course-batch-edit";

type CourseDetailCardProps = {
  courseBatchDetail: Partial<CourseBatch>;
};

export function CourseBatchDetailCard({ courseBatchDetail }: CourseDetailCardProps) {
  const {
    name,
    batch_status,
    poster_url,
    registration_start,
    registration_end,
    start_date,
    end_date,
    instructor_name,
    instructor_job_title,
    instructor_company_name,
    instructor_profile_url,
    base_price,
    discount_type,
    discount_value,
    final_price,
    sessions,
  } = courseBatchDetail;

  const hasDiscount = discount_value !== null && discount_value !== undefined && final_price !== null && final_price !== undefined;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="max-w-full max-h-full">
      {/* ================= HEADER ================= */}
      <CardHeader className="space-y-1">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            {batch_status && (
              <Badge variant="outline" className="to-blue-700">
                {batch_status}
              </Badge>
            )}
            <CardTitle>{name}</CardTitle>
          </div>
          <CourseBatchEditDialog batch={courseBatchDetail as CourseBatch} />
        </div>
      </CardHeader>

      {/* ================= CONTENT ================= */}
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= LEFT ================= */}
        <div className="space-y-2">
          {/* Poster (Tidak Dominan) */}
          <CourseBatchUpload posterUrl={poster_url} />

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Pendaftaran</p>
              <p className="font-medium">
                {formatedDate(registration_start!)} – {formatedDate(registration_end!)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Pelaksanaan</p>
              <p className="font-medium">
                {formatedDate(start_date!)} – {formatedDate(end_date!)}
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* Instructor */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Instuktur</p>
            <div className="flex items-center gap-3">
              {instructor_profile_url && <Image src={instructor_profile_url} width={50} height={50} alt="Instructor" className="rounded-full" />}
              <div>
                <p className="font-medium">{instructor_name}</p>
                <p className="text-xs text-muted-foreground">
                  {instructor_job_title} - {instructor_company_name}
                </p>
              </div>
            </div>
          </div>

          {/* Harga */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Harga</p>
            <p className="text-lg font-semibold">{formatCurrency(hasDiscount ? final_price! : base_price!)}</p>
            {hasDiscount && (
              <div>
                <p className="text-xs text-muted-foreground line-through">{formatCurrency(base_price!)}</p>
                <p className="text-red-500 text-xs font-medium">{discount_type === "PERCENT" ? `${discount_value}% OFF` : `-${formatCurrency(discount_value!)}`}</p>
              </div>
            )}
          </div>

          {/* Sessions */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">Sessions</p>
            {sessions?.length ? (
              sessions.map((session) => (
                <div key={session.course_session_id} className="p-3 border rounded-md">
                  <p className="font-medium text-sm">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatedDate(session.date)} : {session.start_time} - {session.end_time}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No sessions available</p>
            )}
          </div>
        </div>
      </CardContent>

      {/* ================= FOOTER ================= */}
      {/* <CardFooter className="flex justify-end">
        <CourseBatchEditDialog batch={courseBatchDetail as CourseBatch} />
      </CardFooter> */}
    </Card>
  );
}
