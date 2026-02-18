import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

/**
 * Skeleton for the Course Detail page
 * (CourseDetailCard + CourseBatchTable)
 */
export function SkeletonCourseDetail() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="p-4 lg:px-6 flex flex-col gap-10">
                {/* Course Detail Card skeleton */}
                <Card>
                    <CardHeader>
                        <div className="flex gap-2 my-2">
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-4 w-full mt-1" />
                        <Skeleton className="h-4 w-3/4 mt-1" />
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Benefit column */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-16" />
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`b-${i}`} className="space-y-1 py-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-56" />
                                </div>
                            ))}
                        </div>

                        {/* Material column */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-16" />
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`m-${i}`} className="space-y-1 py-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-56" />
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3">
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                    </CardFooter>
                </Card>

                {/* Batch table skeleton (reuse table pattern) */}
                <div className="space-y-4">
                    <div className="rounded-md border overflow-hidden">
                        <div className="border-b bg-muted/40 px-3 py-3 flex gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={`bh-${i}`} className="h-4 flex-1" />
                            ))}
                        </div>
                        {Array.from({ length: 3 }).map((_, rowIdx) => (
                            <div
                                key={rowIdx}
                                className="flex gap-4 px-3 py-3 border-b last:border-0"
                            >
                                {Array.from({ length: 4 }).map((_, colIdx) => (
                                    <Skeleton
                                        key={`br-${rowIdx}-${colIdx}`}
                                        className="h-4 flex-1"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for the Course Batch Detail page
 * (CourseBatchDetailCard)
 */
export function SkeletonBatchDetail() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="p-4 lg:px-6 flex flex-col gap-10">
                <Card>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-6 w-52" />
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left column */}
                        <div className="space-y-6">
                            {/* Poster placeholder */}
                            <Skeleton className="w-full h-56 rounded-md" />

                            <div className="space-y-4">
                                <div>
                                    <Skeleton className="h-3 w-24 mb-1" />
                                    <Skeleton className="h-4 w-52" />
                                </div>
                                <div>
                                    <Skeleton className="h-3 w-24 mb-1" />
                                    <Skeleton className="h-4 w-52" />
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            {/* Instructor */}
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-44" />
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-6 w-32" />
                            </div>

                            {/* Sessions */}
                            <div className="space-y-3">
                                <Skeleton className="h-3 w-16" />
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={`s-${i}`} className="p-3 border rounded-md space-y-1">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-36" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
