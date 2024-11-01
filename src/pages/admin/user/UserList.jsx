import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useAxios from "@/hooks/useAxios";
import usePagination from "@/hooks/usePagination";
import useSorting from "@/hooks/useSorting";

import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePickerWithRange from "@/components/DataPickerWithRange";
import { format } from "date-fns";

const UserList = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const [data, setData] = useState({
    totalCount: 0,
    dataList: [],
  });

  const location = useLocation();
  const paramsRef = useRef();
  const searchParams = location.state ? location.state.searchCondition : null;

  const [searchCondition, setSearchCondition] = useState({
    userName: searchParams ? searchParams.userName : "",
    email: searchParams ? searchParams.email : "",
    startCreatedDate: "",
    endCreatedDate: "",
  });

  const breadCrumbList = [{ url: `/admin/users`, name: `사용자관리` }];

  const columns = useMemo(
    () => [
      {
        accessorKey: "rowNumber",
        header: "번호",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "userName",
        header: "이름",
        size: 100,
        enableSorting: true,
        cell: ({ row }) => {
          const userId = row.original.userId;
          return (
            <Link
              to={`/users/${userId}`}
              state={{ searchCondition: paramsRef.current }}
            >
              {row.getValue("userName")}
            </Link>
          );
        },
      },
      {
        accessorKey: "email",
        header: "이메일",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "createdDate",
        header: "등록일",
        size: 100,
        enableSorting: true,
      },
    ],
    []
  );

  const gotoRegister = () => {
    navigate(`/admin/users/create`);
  };

  const { pageIndex, pageSize, onPaginationChange, pagination } = usePagination(
    searchParams ? searchParams.pageSize : 10,
    searchParams ? searchParams.pageIndex : 0
  );

  const { sorting, onSortingChange, field, order } = useSorting(
    searchParams ? searchParams.sortColumn : "rowNumber",
    searchParams ? searchParams.sortDirection : "DESC"
  );

  const retrievePostList = () => {
    const paramsObj = {
      startIndex: pageIndex * pageSize,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortColumn: field,
      sortDirection: order,
      userName: searchCondition.userName,
      email: searchCondition.email,
      startCreatedDate: searchCondition.startCreatedDate
        ? format(searchCondition.startCreatedDate, "yyyy-MM-dd")
        : "",
      endCreatedDate: searchCondition.endCreatedDate
        ? format(searchCondition.endCreatedDate, "yyyy-MM-dd")
        : "",
    };
    const searchParams = new URLSearchParams(paramsObj);
    paramsRef.current = paramsObj;
    api({
      url: `/api/admin/users?${searchParams.toString()}`,
      method: "GET",
    }).then((response) => {
      setData({
        totalCount: response.data.data.totalCount,
        dataList: response.data.data.dataList,
      });
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCondition((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreatedDate = ({ from, to }) => {
    setSearchCondition((prevState) => {
      return { ...prevState, startCreatedDate: from, endCreatedDate: to };
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      retrievePostList();
    }
  };

  useEffect(() => {
    retrievePostList();
  }, [pagination, sorting]);

  return (
    <>
      <div className="my-4">
        <PageHeader title="사용자관리" itemList={breadCrumbList} />
      </div>
      <div>
        <div className="flex w-full justify-center items-center">
          <div className="flex w-full items-center">
            <Label htmlFor="userName" className="w-40 text-center">
              이름
            </Label>
            <Input
              type="text"
              id="userName"
              name="userName"
              value={searchCondition.userName}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="flex w-full items-center">
            <Label htmlFor="email" className="w-40 text-center">
              이메일
            </Label>
            <Input
              type="text"
              id="email"
              name="email"
              value={searchCondition.email}
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
          <Button type="button" onClick={gotoRegister}>
            등록
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserList;