import { CourseTable } from "@/features/course";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <CourseTable />
      </div>
    </div>
  );
}
