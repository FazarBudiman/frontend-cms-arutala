"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatedDate } from "@/shared/utils/date";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IconDeviceImacCode } from "@tabler/icons-react";

type UpcomingCoursesProps = {
  courses: {
    course_id: string;
    course_title: string;
    course_batch_name: string;
    course_batch_start_date: string;
    course_batch_status: string;
  }[];
};

export function UpcomingCourses({ courses }: UpcomingCoursesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Courses</CardTitle>
        <CardDescription>Courses starting soon</CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        {courses.length ? (
          courses.map((course) => (
            <div key={course.course_id} className="p-3 border rounded-md flex flex-col">
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">Dimulai pada: {formatedDate(course.course_batch_start_date)}</p>
                <Badge className="h-fit text-xs">{course.course_batch_status}</Badge>
              </div>
              <p className="font-medium text-sm">{course.course_title}</p>
              <p className="text-xs text-muted-foreground">{course.course_batch_name}</p>
            </div>
          ))
        ) : (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconDeviceImacCode />
              </EmptyMedia>
              <EmptyTitle className="text-sm">No courses</EmptyTitle>
              <EmptyDescription className="text-xs">No courses starting soon.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
