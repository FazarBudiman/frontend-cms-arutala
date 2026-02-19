"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonTable } from "@/components/skeleton-table";
import { ArticleAddSheet } from "./article-add";
import { useArticles } from "../hook";

export function ArticleTable() {
  const { data: articles, isLoading } = useArticles();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, sorting]);

  React.useEffect(() => {
    const pageCount = Math.ceil((articles?.length ?? 0) / pagination.pageSize);
    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }));
    }
  }, [articles, pagination.pageSize, pagination.pageIndex]);

  const uniqueStatus = useMemo(() => {
    if (!articles) {
      return [];
    }

    return Array.from(new Set(articles.map((article) => article.article_status))).map((status) => ({
      value: status,
      label: status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [articles]);

  const setColumnFilter = (id: string, value: string | null) => {
    setFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  if (isLoading) return <SkeletonTable />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between px-8">
        <div className="flex items-center gap-4">
          {/* Search by Title */}
          <Input placeholder="Search by title..." onChange={(e) => setColumnFilter("article_title", e.target.value)} className="max-w-sm" />

          {/* Filter by Status */}
          <Select defaultValue="ALL" onValueChange={(v) => setColumnFilter("article_status", v !== "ALL" ? v : null)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="ALL">All Status</SelectItem>
                {uniqueStatus.map((status) => {
                  return (
                    <SelectItem value={status.value} key={status.value}>
                      {status.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ArticleAddSheet />
      </div>

      <DataTable
        data={articles ?? []}
        columns={columns}
        getRowId={(row) => row.article_id}
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
