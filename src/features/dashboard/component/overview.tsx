"use client";
import { useOverview } from "../hook";
import { ChartArea } from "./chart-area";
import { RecentMessages } from "./recent-messages";
import { UpcomingCourses } from "./upcoming-courses";
import { SkeletonDashboard } from "@/components/skeleton-dashboard";

export default function OverviewPage() {
  const { data, isPending } = useOverview();

  if (isPending) {
    return <SkeletonDashboard />;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  console.log(data);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentMessages messages={data.messages.recent} />
        <UpcomingCourses courses={data.courses.upcoming} />
      </div>
      <ChartArea stats={data.messages.stats} />
    </div>
  );
}
