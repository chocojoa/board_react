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
    const table = useReactTable({
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
    });

    useImperativeHandle(ref, () => ({
      getTable() {
        return table;
      },
    }));

    return (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        {...(header.column.getCanSort()
                          ? { onClick: header.column.getToggleSortingHandler() }
                          : [])}
                      >
                        <div className="flex items-center select-none cursor-pointer">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getIsSorted() === "asc" ? (
                            <span className="ml-1">
                              <ChevronUpIcon />
                            </span>
                          ) : header.column.getIsSorted() === "desc" ? (
                            <span className="ml-1">
                              <ChevronDownIcon />
                            </span>
                          ) : null}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
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
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-12 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
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
