import { MitraTable } from "@/features/mitras";

export default async function MitraPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <MitraTable />
      </div>
    </div>
  );
}
