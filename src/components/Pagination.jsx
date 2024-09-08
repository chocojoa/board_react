import { Button } from "./ui/button";

const Pagination = ({ table }) => {
  return (
    <>
      <footer className="pagination">
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
        >
          ⏪
        </Button>
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={table.previousPage}
        >
          ◀️
        </Button>
        <span>{`page ${
          table.getState().pagination.pageIndex + 1
        } of ${table.getPageCount()}`}</span>
        <Button disabled={!table.getCanNextPage()} onClick={table.nextPage}>
          ▶️
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        >
          ⏩
        </Button>
        <span>Show: </span>
        <select
          value={table.getState().pageSize}
          onChange={(e) => table.setPageSize(parseInt(e.target.value, 10))}
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span> items per page</span>
      </footer>
    </>
  );
};

export default Pagination;
