"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseDetail } from "../type";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { IconCircleArrowLeft, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type CourseDetailCardProps = {
  courseDetail: Partial<CourseDetail>;
};

export function CourseDetailCard({ courseDetail }: CourseDetailCardProps) {
  const { course_title, course_description, course_category_name, course_field_name, courseBenefit, courseMaterial } = courseDetail;
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-3">
          <Button variant="outline" size="icon-sm" onClick={() => router.push(`/content-website/courses`)}>
            <IconCircleArrowLeft className="size-5" />
          </Button>

          <div className="flex flex-col items-start gap-1 mt-1">
            <CardTitle>{course_title}</CardTitle>
            <CardDescription>{course_description}</CardDescription>
          </div>

          <div className=" flex gap-2">
            <Badge className={courseDetail.is_displayed ? "bg-success " : "bg-destructive "}>{courseDetail.is_displayed ? "Published" : "Unpublished"}</Badge>
            <Badge>{course_category_name}</Badge>
            <Badge variant="secondary">{course_field_name}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-1">
          <h5 className="font-medium">Benefit</h5>

          <div className="space-y-0">
            {courseBenefit?.map((benefit, index) => (
              <Item key={index} className="py-2">
                <ItemContent>
                  <ItemTitle className="text-sm leading-tight">{benefit.title}</ItemTitle>
                  <ItemDescription className="text-xs text-muted-foreground leading-tight">{benefit.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </div>

        {/* ================= MATERIAL ================= */}
        <div className="space-y-1">
          <h5 className="font-medium ">Material</h5>

          <div className="space-y-0">
            {courseMaterial?.map((material, index) => (
              <Item key={index} className="py-2">
                <ItemContent>
                  <ItemTitle className="text-sm leading-tight">{material.title}</ItemTitle>
                  <ItemDescription className="text-xs text-muted-foreground leading-tight">{material.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={() => router.push(`/content-website/courses/${courseDetail.course_id}/edit`)}>
          Edit Course <IconPencil />
        </Button>
        <Button size="sm" onClick={() => router.push(`/content-website/courses/${courseDetail.course_id}/batch/create`)}>
          Tambah Batch <PlusCircle />
        </Button>
      </CardFooter>
    </Card>
  );
}
