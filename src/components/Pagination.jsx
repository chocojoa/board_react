import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "./ui/select";

const Pagination = ({ table }) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = Math.ceil(table.getRowCount() / pageSize);
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i);

  const renderPageSizeSelector = () => (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">페이지당 행</p>
      <Select
        value={String(pageSize)}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[10, 20, 30, 40, 50].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderNavigationButtons = () => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <DoubleArrowLeftIcon />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon />
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(number)}
          className={pageIndex === number ? "font-bold" : ""}
        >
          {number + 1}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRightIcon />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <DoubleArrowRightIcon />
      </Button>
    </div>
  );

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center justify-center text-sm font-medium">
        페이지 {pageIndex + 1} / {table.getPageCount()}
      </div>
      {renderNavigationButtons()}
      {renderPageSizeSelector()}
    </div>
  );
};

export default Pagination;
