import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import useAxios from "@/hooks/useAxios";
import usePagination from "@/hooks/usePagination";
import useSorting from "@/hooks/useSorting";

import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePickerWithRange from "@/components/DataPickerWithRange";

// 검색 조건 초기값 상수화
const INITIAL_SEARCH_CONDITION = {
  title: "",
  author: "",
  startCreatedDate: "",
  endCreatedDate: "",
};

// 페이지네이션 초기값 상수화
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_INDEX = 0;

// 정렬 초기값 상수화
const DEFAULT_SORT_COLUMN = "rowNumber";
const DEFAULT_SORT_DIRECTION = "DESC";

const PostList = () => {
  const pageTitle = "자유게시판";
  const navigate = useNavigate();
  const api = useAxios();
  const { categoryId } = useParams();
  const [data, setData] = useState({
    totalCount: 0,
    dataList: [],
  });

  const location = useLocation();
  const paramsRef = useRef();
  const searchParams = location.state?.searchCondition;

  const [searchCondition, setSearchCondition] = useState({
    ...INITIAL_SEARCH_CONDITION,
    title: searchParams?.title ?? "",
    author: searchParams?.author ?? "",
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
        cell: ({ row }) => (
          <Link
            to={`/boards/${row.original.categoryId}/posts/${row.original.postId}`}
            state={{ searchCondition: paramsRef.current }}
          >
            {row.getValue("title")}
          </Link>
        ),
      },
      {
        accessorKey: "viewCount",
        header: "조회수",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "author",
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

  const { pageIndex, pageSize, onPaginationChange, pagination } = usePagination(
    searchParams?.pageSize ?? DEFAULT_PAGE_SIZE,
    searchParams?.pageIndex ?? DEFAULT_PAGE_INDEX
  );

  const { sorting, onSortingChange, field, order } = useSorting(
    searchParams?.sortColumn ?? DEFAULT_SORT_COLUMN,
    searchParams?.sortDirection ?? DEFAULT_SORT_DIRECTION
  );

  const getSearchParams = () => ({
    startIndex: pageIndex * pageSize,
    pageIndex,
    pageSize,
    sortColumn: field,
    sortDirection: order,
    title: searchCondition.title,
    author: searchCondition.author,
    startCreatedDate: searchCondition.startCreatedDate
      ? format(searchCondition.startCreatedDate, "yyyy-MM-dd")
      : "",
    endCreatedDate: searchCondition.endCreatedDate
      ? format(searchCondition.endCreatedDate, "yyyy-MM-dd")
      : "",
  });

  const retrievePostList = async () => {
    const paramsObj = getSearchParams();
    const searchParams = new URLSearchParams(paramsObj);
    paramsRef.current = paramsObj;

    try {
      const response = await api({
        url: `/api/boards/${categoryId}/posts?${searchParams.toString()}`,
        method: "GET",
      });

      setData({
        totalCount: response.data.data.totalCount,
        dataList: response.data.data.dataList,
      });
    } catch (error) {
      console.error("게시글 조회 실패:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCondition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatedDate = ({ from, to }) => {
    setSearchCondition((prev) => ({
      ...prev,
      startCreatedDate: from,
      endCreatedDate: to,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      retrievePostList();
    }
  };

  const gotoRegister = () => {
    navigate(`/boards/${categoryId}/posts/create`);
  };

  useEffect(() => {
    retrievePostList();
  }, [pagination, sorting]);

  return (
    <div className="my-4">
      <PageHeader title={pageTitle} />
      <div>
        <div className="flex w-full justify-center items-center">
          <div className="flex w-full items-center">
            <Label htmlFor="title" className="w-40 text-center">
              제목
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={searchCondition.title}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="flex w-full items-center">
            <Label htmlFor="author" className="w-40 text-center">
              작성자
            </Label>
            <Input
              type="text"
              id="author"
              name="author"
              value={searchCondition.author}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="flex w-full items-center">
            <Label htmlFor="datePicker" className="w-40 text-center">
              작성일
            </Label>
            <DatePickerWithRange
              id="datePicker"
              className="w-full"
              from={searchCondition.startCreatedDate}
              to={searchCondition.endCreatedDate}
              setDate={handleCreatedDate}
            />
          </div>
          <Button className="ml-4" onClick={retrievePostList}>
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
      <div className="flex w-full justify-end">
        <div className="items-end">
          <Button type="button" variant="outline" onClick={gotoRegister}>
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostList;
