import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const UserList = () => {
  const pageTitle = "사용자관리";
  const navigate = useNavigate();
  const api = useAxios();
  const location = useLocation();
  const paramsRef = useRef();

  const searchParams = location.state?.searchCondition;

  const [data, setData] = useState({
    totalCount: 0,
    dataList: [],
  });

  const [searchCondition, setSearchCondition] = useState({
    userName: searchParams?.userName ?? "",
    email: searchParams?.email ?? "",
    startCreatedDate: "",
    endCreatedDate: "",
  });

  const { pageIndex, pageSize, onPaginationChange, pagination } = usePagination(
    searchParams?.pageSize ?? 10,
    searchParams?.pageIndex ?? 0
  );

  const { sorting, onSortingChange, field, order } = useSorting(
    searchParams?.sortColumn ?? "rowNumber",
    searchParams?.sortDirection ?? "DESC"
  );

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
        cell: ({ row }) => (
          <Link
            to={`/admin/users/${row.original.userId}`}
            state={{ searchCondition: paramsRef.current }}
          >
            {row.getValue("userName")}
          </Link>
        ),
      },
      {
        accessorKey: "email",
        header: "이메일",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "createdAt",
        header: "등록일",
        size: 100,
        enableSorting: true,
      },
    ],
    []
  );

  const getSearchParams = () => {
    const params = {
      startIndex: pageIndex * pageSize,
      pageIndex,
      pageSize,
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
    return new URLSearchParams(params);
  };

  const retrieveUserList = async () => {
    const searchParams = getSearchParams();
    paramsRef.current = Object.fromEntries(searchParams);

    const response = await api({
      url: `/api/admin/users?${searchParams.toString()}`,
      method: "GET",
    });

    setData({
      totalCount: response.data.data.totalCount,
      dataList: response.data.data.dataList,
    });
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
      retrieveUserList();
    }
  };

  const gotoRegister = () => {
    navigate("/admin/users/create");
  };

  useEffect(() => {
    retrieveUserList();
  }, [pagination, sorting]);

  return (
    <div className="my-4">
      <PageHeader title={pageTitle} />
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
          <Button className="ml-4" onClick={retrieveUserList}>
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
          <Button type="button" onClick={gotoRegister}>
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
