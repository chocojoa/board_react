import { useState } from "react";

const usePagination = (initPageSize = 10, initPageIndex = 0) => {
  const [pagination, setPagination] = useState({
    pageSize: initPageSize,
    pageIndex: initPageIndex,
  });
  const { pageSize, pageIndex } = pagination;

  return {
    onPaginationChange: setPagination,
    pagination,
    pageSize: pageSize,
    pageIndex: pageIndex,
  };
};

export default usePagination;
