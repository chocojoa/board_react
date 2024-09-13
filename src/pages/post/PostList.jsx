import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import useAxios from "@/hooks/useAxios";
import usePagination from "@/hooks/usePagination";
import useSorting from "@/hooks/useSorting";

import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PostList = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { categoryId } = useParams();
  const [data, setData] = useState({
    totalCount: 0,
    dataList: [],
  });

  const breadCrumbList = [
    { url: `/categories/${categoryId}/posts`, name: `자유게시판` },
  ];

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
        cell: ({ row }) => {
          const categoryId = row.original.categoryId;
          const postId = row.original.postId;
          return (
            <Link to={`/boards/${categoryId}/posts/${postId}`}>
              {row.getValue("title")}
            </Link>
          );
        },
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

  const gotoRegister = () => {
    navigate(`/boards/${categoryId}/posts/create`);
  };

  const titleRef = useRef();
  const authorRef = useRef();

  const { pageIndex, pageSize, onPaginationChange, pagination } =
    usePagination();

  const { sorting, onSortingChange, field, order } = useSorting();

  const retrievePostList = (
    pageIndex = 0,
    pageSize = 10,
    field = "rowNumber",
    order = "desc"
  ) => {
    const paramsObj = {
      startIndex: pageIndex * pageSize,
      pageSize: pageSize,
      sortColumn: field,
      sortDirection: order,
      title: titleRef.current.value,
      author: authorRef.current.value,
    };

    const searchParams = new URLSearchParams(paramsObj);
    api({
      url: `/api/boards/${categoryId}/posts?${searchParams.toString()}`,
      method: "GET",
    }).then((response) => {
      setData({
        totalCount: response.data.data.totalCount,
        dataList: response.data.data.dataList,
      });
    });
  };

  useEffect(() => {
    retrievePostList(pageIndex, pageSize, field, order);
  }, [pagination, sorting]);

  return (
    <>
      <div className="my-4">
        <PageHeader title="자유게시판" itemList={breadCrumbList} />
      </div>
      <div>
        <div className="flex w-full justify-center items-center">
          <Label htmlFor="title" className="w-40 text-center">
            제목
          </Label>
          <Input type="text" id="title" ref={titleRef} />
          <Label htmlFor="title" className="w-40 text-center">
            작성자
          </Label>
          <Input type="text" id="author" ref={authorRef} />
          <Button className="ml-4" onClick={() => retrievePostList()}>
            검색
          </Button>
        </div>
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
      <div className="flex w-full justify-end py-4">
        <div className="items-end">
          <Button onClick={gotoRegister}>등록</Button>
        </div>
      </div>
    </>
  );
};

export default PostList;
