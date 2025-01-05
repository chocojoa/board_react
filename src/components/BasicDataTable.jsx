import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { forwardRef, useImperativeHandle } from "react";

const BasicDataTable = forwardRef(({ columns, data }, ref) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useImperativeHandle(ref, () => ({
    getTable: () => table,
  }));

  const renderHeaderCell = (header) => (
    <div className="flex items-center select-none cursor-pointer">
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  );

  const renderTableRow = (row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );

  const renderNoResults = () => (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-12 text-center">
        검색 결과가 없습니다.
      </TableCell>
    </TableRow>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                >
                  {renderHeaderCell(header)}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map(renderTableRow)
            : renderNoResults()}
        </TableBody>
      </Table>
    </div>
  );
});

BasicDataTable.displayName = "BasicDataTable";

export default BasicDataTable;
