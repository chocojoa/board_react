import { useState } from "react";

const usePagination = () => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
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
