import DataTable from "@/components/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useAxios from "@/hooks/useAxios";
import usePagination from "@/hooks/usePagination";
import useSorting from "@/hooks/useSorting";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

const Post = () => {
  const api = useAxios();
  const [data, setData] = useState({
    totalCount: 0,
    dataList: [],
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "rowNumber",
        header: "번호",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "title",
        header: "제목",
        size: 400,
        enableSorting: true,
      },
      {
        accessorKey: "viewCount",
        header: "조회수",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "userName",
        header: "작성자",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "createdDate",
        header: "작성일",
        size: 100,
        enableSorting: true,
      },
    ],
    []
  );

  const { pageIndex, pageSize, onPaginationChange, pagination } =
    usePagination();

  const { sorting, onSortingChange, field, order } = useSorting();

  const retrievePosts = (pageIndex, pageSize, field, order) => {
    const startIndex = pageIndex * pageSize;

    api({
      url: `/api/boards/free/posts?startIndex=${startIndex}&pageSize=${pageSize}&sortColumn=${field}&sortDirection=${order}`,
      method: "GET",
    }).then((response) => {
      setData({
        totalCount: response.data.data.totalCount,
        dataList: response.data.data.dataList,
      });
    });
  };

  useEffect(() => {
    retrievePosts(pageIndex, pageSize, field, order);
  }, [pagination, sorting]);

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/board">Board</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <p className="text-lg font-bold">자유게시판</p>
      </div>
      <div className="py-6">
        <DataTable
          columns={columns}
          data={data.dataList}
          totalCount={data.totalCount}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          sorting={sorting}
          onSortingChange={onSortingChange}
        />
      </div>
    </>
  );
};

export default Post;
