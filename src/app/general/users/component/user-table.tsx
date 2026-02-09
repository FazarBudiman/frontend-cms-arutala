"use client";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { column } from "./column";
import { DataTable } from "../../../../components/data-table";
import { Input } from "../../../../components/ui/input";
import { useUsers } from "@/hooks/use-user";
import { SkeletonTable } from "@/components/skeleton-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAddSheet } from "./user-add";

export function UserTable() {
  const { data: users, isLoading } = useUsers();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);

  const uniqueRoles = useMemo(() => {
    if (!users) return [];

    return Array.from(new Set(users.map((user) => user.role_name))).map((roleName) => ({
      value: roleName,
      label: roleName
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [users]);

  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  return (
    <div className="space-y-4 ">
      <div className=" flex justify-between  px-8">
        {/* Toolbar */}
        <div className="flex items-center gap-4 ">
          {/* Search by name */}
          <Input placeholder="Search by name..." onChange={(e) => setColumnFilter("full_name", e.target.value)} className="max-w-sm" />

          {/* Filter by role */}
          <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("role_name", v !== "ALL" ? v : null)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter role" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Role</SelectItem>
                {uniqueRoles.map((role) => {
                  return (
                    <SelectItem value={role.value} key={role.value}>
                      {role.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Sheet Add User */}
        <UserAddSheet />
      </div>

      {/* Table */}
      {isLoading ? <SkeletonTable /> : <DataTable data={users ?? []} columns={column} getRowId={(row) => row.user_id} sorting={sorting} columnFilters={filters} onSortingChange={setSorting} onColumnFiltersChange={setFilters} />}
    </div>
  );
}
