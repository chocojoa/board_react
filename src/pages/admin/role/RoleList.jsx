import { useEffect, useMemo, useState } from "react";

import useAxios from "@/hooks/useAxios";
import usePagination from "@/hooks/usePagination";
import useSorting from "@/hooks/useSorting";

import RoleModal from "./RoleModal";
import DataTable from "@/components/DataTable";

const RoleList = () => {
  const api = useAxios();
  const [data, setData] = useState({ totalCount: 0, dataList: [] });
  const { pageIndex, pageSize, onPaginationChange, pagination } =
    usePagination();
  const { sorting, onSortingChange, field, order } = useSorting(
    "rowNumber",
    "DESC"
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
        accessorKey: "roleName",
        header: "권한명",
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "description",
        header: "설명",
        size: 350,
        enableSorting: true,
      },
      {
        accessorKey: "createdBy",
        header: "등록자",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "createdAt",
        header: "등록일",
        size: 100,
        enableSorting: true,
      },
      {
        header: "수정/삭제",
        size: 100,
        enableSorting: true,
        cell: ({ row }) => (
          <RoleModal
            retrieveRoleList={retrieveRoleList}
            roleId={row.original.roleId}
          />
        ),
      },
    ],
    []
  );

  const retrieveRoleList = async () => {
    try {
      const params = {
        startIndex: pageIndex * pageSize,
        pageIndex,
        pageSize,
        sortColumn: field,
        sortDirection: order,
      };
      const searchParams = new URLSearchParams(params);
      const response = await api.get(`/api/admin/roles?${searchParams}`);
      const { totalCount, dataList } = response.data.data;

      setData({ totalCount, dataList });
    } catch (error) {
      console.error("권한 목록 조회 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    retrieveRoleList();
  }, [pagination, sorting]);

  return (
    <>
      <DataTable
        columns={columns}
        data={data.dataList}
        totalCount={data.totalCount}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
      <div className="flex w-full justify-end pt-4">
        <RoleModal retrieveRoleList={retrieveRoleList} />
      </div>
    </>
  );
};

export default RoleList;
