import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import { forwardRef, useImperativeHandle } from "react";

const DataTable = forwardRef(
  (
    {
      columns,
      data,
      totalCount,
      pagination,
      onPaginationChange,
      sorting,
      onSortingChange,
    },
    ref
  ) => {
    const tableConfig = {
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      rowCount: totalCount,
      manualPagination: true,
      manualSorting: true,
      onPaginationChange,
      onSortingChange,
      autoResetPageIndex: false,
      state: {
        pagination,
        sorting,
      },
    };

    const table = useReactTable(tableConfig);

    useImperativeHandle(ref, () => ({
      getTable: () => table,
    }));

    const renderSortIcon = (column) => {
      const sortDirection = column.getIsSorted();
      if (!sortDirection) return null;

      return (
        <span className="ml-1">
          {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      );
    };

    const renderHeaderCell = (header) => {
      if (header.isPlaceholder) return null;

      return (
        <div className="flex items-center select-none cursor-pointer">
          {flexRender(header.column.columnDef.header, header.getContext())}
          {renderSortIcon(header.column)}
        </div>
      );
    };

    const renderNoResults = () => (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-12 text-center">
          검색 결과가 없습니다.
        </TableCell>
      </TableRow>
    );

    return (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {renderHeaderCell(header)}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : renderNoResults()}
            </TableBody>
          </Table>
        </div>
        <Pagination table={table} />
      </>
    );
  }
);

DataTable.displayName = "DataTable";

export default DataTable;
