import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonDashboard() {
    return (
        <div className="space-y-6 px-4 lg:px-6">
            {/* Two cards grid — Recent Messages + Upcoming Courses */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Messages skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-52 mt-1" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={`msg-${i}`}
                                className="flex flex-col gap-2 border-b pb-3 last:border-0"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-44" />
                                    </div>
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Upcoming Courses skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-44 mt-1" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={`course-${i}`}
                                className="flex items-center justify-between border-b pb-3 last:border-0"
                            >
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-4 w-44" />
                                    <Skeleton className="h-3 w-28" />
                                    <Skeleton className="h-3 w-36" />
                                </div>
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Chart area skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-72 mt-1" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full rounded-md" />
                </CardContent>
            </Card>
        </div>
    );
}
