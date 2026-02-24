"use client";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { column } from "./column";

import { SkeletonTable } from "@/components/skeleton-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAddDialog } from "./user-add";
import { useUsers } from "../hooks";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

export function UserTable() {
  const { data: users, isLoading } = useUsers();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filters, sorting]);

  React.useEffect(() => {
    const pageCount = Math.ceil((users?.length ?? 0) / pagination.pageSize);

    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageCount - 1,
      }));
    }
  }, [users, pagination.pageSize, pagination.pageIndex]);

  const uniqueRoles = useMemo(() => {
    if (!users) return [];

    return Array.from(new Set(users.map((user) => user.role_name))).map((roleName) => ({
      value: roleName,
      label: formatSnakeCaseToTitle(roleName),
    }));
  }, [users]);

  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  if (isLoading) return <SkeletonTable />;

  return (
    <div className="space-y-4 ">
      <div className=" flex justify-between px-8 ">
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

        {/* Add User */}
        <UserAddDialog />
      </div>

      {/* Table */}

      <DataTable
        data={users ?? []}
        columns={column}
        getRowId={(row) => row.user_id}
        sorting={sorting}
        columnFilters={filters}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setFilters}
      />
    </div>
  );
}
