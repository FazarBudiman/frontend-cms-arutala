"use client";

import { redirect, useParams } from "next/navigation";

export default function CourseBatchPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  redirect(`/content-website/courses/${courseId}`);
}
