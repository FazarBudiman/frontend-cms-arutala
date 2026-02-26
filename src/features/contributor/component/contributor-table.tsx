"use client";

import React, { useMemo } from "react";
import { DataTable, useTableState } from "@/components/shared/data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContributorAddDialog } from "./contributor-add";
import { useContributors } from "../hook";
import { getUniqueOptions } from "@/shared/utils/filter";
import { Contributor } from "../type";

const getRowId = (row: Contributor) => row.contributor_id;

export function ContributorTable() {
  const { data: contributors, isLoading } = useContributors();
  const table = useTableState(8);

  const expertiseOptions = useMemo(() => {
    if (!contributors) return [];
    const allExpertise = contributors.flatMap((c) => c.contributor_expertise);
    return Array.from(new Set(allExpertise)).map((expert) => ({
      value: expert,
      label: expert,
    }));
  }, [contributors]);

  const typeOptions = useMemo(() => {
    return getUniqueOptions(contributors, "contributor_type", (type) => (type === "INTERNAL" ? "Mentor" : "Bukan Mentor"));
  }, [contributors]);

  const statusOptions = useMemo(() => {
    return getUniqueOptions(contributors, "is_displayed", (status) => (status ? "Published" : "Unpublished"));
  }, [contributors]);

  return (
    <div className="space-y-4">
      <div className=" flex justify-between  px-8">
        <div className="flex items-center gap-4">
          <Input placeholder="Search by name..." onChange={(e) => table.setColumnFilter("contributor_name", e.target.value)} className="max-w-sm" />

          {/* Filter by Type */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("contributor_type", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Type" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Type</SelectItem>
                {typeOptions.map((type) => {
                  return (
                    <SelectItem value={type.value} key={type.value}>
                      {type.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filter by Expertise */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("contributor_expertise", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Expertise" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Expertise</SelectItem>
                {expertiseOptions.map((expert) => (
                  <SelectItem value={expert.value} key={expert.value}>
                    {expert.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filter by Status */}
          <Select defaultValue="ALL" onValueChange={(v) => table.setColumnFilter("is_displayed", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem value={status.value} key={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ContributorAddDialog />
      </div>

      <DataTable data={contributors ?? []} columns={columns} getRowId={getRowId} isLoading={isLoading} {...table} />
    </div>
  );
}
