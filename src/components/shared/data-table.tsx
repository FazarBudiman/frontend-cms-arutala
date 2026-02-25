"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SkeletonTable } from "@/components/shared/skeleton-table";

/* =======================
   Hooks
======================= */

export function useTableState(initialPageSize = 8) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const setColumnFilter = (id: string, value: string | null) => {
    setColumnFilters((prev) => {
      const others = prev.filter((f) => f.id !== id);
      return value ? [...others, { id, value }] : others;
    });
  };

  return {
    sorting,
    columnFilters,
    pagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    setColumnFilter,
  };
}

/* =======================
   Props
======================= */

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  /** wajib agar table tidak bergantung ke field tertentu */
  getRowId: (row: TData) => string;

  /** state management (can be spread from useTableState) */
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  onSortingChange: OnChangeFn<SortingState>;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  onPaginationChange: OnChangeFn<PaginationState>;

  isLoading?: boolean;
  pageSizeOptions?: number[];
}

/* =======================
   Component
 ======================= */

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowId,
  sorting,
  columnFilters,
  pagination,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  isLoading,
  pageSizeOptions = [8, 15, 30, 50],
}: DataTableProps<TData, TValue>) {
  "use no memo"; // eslint-disable-line

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getRowId,

    state: {
      pagination,
      rowSelection,
      sorting,
      columnFilters,
    },

    enableRowSelection: true,

    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnFiltersChange,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Reset pagination to first page when filtering or sorting changes
  React.useEffect(() => {
    table.setPageIndex(0);
  }, [columnFilters, sorting]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ensure pageIndex is within bounds when data size changes (clamping)
  const pageSize = table.getState().pagination.pageSize;
  React.useEffect(() => {
    const pageCount = table.getPageCount();
    const { pageIndex } = table.getState().pagination;

    if (pageIndex >= pageCount && pageCount > 0) {
      table.setPageIndex(pageCount - 1);
    }
  }, [data.length, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <SkeletonTable columns={columns.length} />;
  }

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-2">
        {/* PAGE SIZE */}
        <div className="flex items-center gap-2 h-2">
          <Label className="text-sm text-muted-foreground">Rows per page</Label>

          <Select value={String(table.getState().pagination.pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger className="h-8 w-17.5 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="p-1">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)} className="h-8 py-1 text-sm">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PAGE INFO + PAGINATION */}
        <div className="flex items-center gap-6 whitespace-nowrap">
          <Label className="text-xs text-muted-foreground">Total Data: {data.length}</Label>

          <Label className="text-xs text-muted-foreground">
            Page {data.length === 0 ? 0 : currentPage + 1} of {pageCount}
          </Label>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => table.getCanPreviousPage() && table.previousPage()} aria-disabled={!table.getCanPreviousPage()} />
              </PaginationItem>

              {Array.from({ length: pageCount }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink isActive={index === currentPage} onClick={() => table.setPageIndex(index)} className="h-8 w-8 text-sm">
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext onClick={() => table.getCanNextPage() && table.nextPage()} aria-disabled={!table.getCanNextPage()} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
