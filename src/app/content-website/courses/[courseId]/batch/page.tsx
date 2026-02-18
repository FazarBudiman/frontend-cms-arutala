'use client'

import { redirect, useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const courseId = params.courseId as string;
    redirect(`/content-website/courses/${courseId}`);
}
