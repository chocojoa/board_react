import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { toast } from "sonner";
import useAxios from "@/hooks/useAxios";
import usePagination from "@/hooks/usePagination";
import useSorting from "@/hooks/useSorting";

import BasicDataTable from "@/components/BasicDataTable";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserRole = () => {
  const user = useSelector((state) => state.auth.user);
  const api = useAxios();

  const [role, setRole] = useState({ totalCount: 0, dataList: [] });
  const [userInfo, setUserInfo] = useState({ totalCount: 0, dataList: [] });
  const [userRole, setUserRole] = useState([]);
  const [roleId, setRoleId] = useState(0);

  const userTable = useRef();
  const addUserTable = useRef();

  const { pageIndex, pageSize, onPaginationChange, pagination } =
    usePagination();
  const { sorting, onSortingChange, field, order } = useSorting(
    "userName",
    "ASC"
  );

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
      },
      {
        accessorKey: "userName",
        header: "이름",
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "이메일",
        size: 100,
        enableSorting: true,
      },
    ],
    []
  );

  const fetchRoleList = async () => {
    try {
      const { data } = await api.get("/api/admin/roles?sortColumn=roleName");
      const { totalCount, dataList } = data.data;
      setRole({ totalCount, dataList });
    } catch (error) {
      toast.error("권한 목록 조회 중 오류가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const fetchUserRoleList = async (roleId) => {
    try {
      const { data } = await api.get(`/api/admin/userRole/${roleId}`);
      setUserRole(data.data);
    } catch (error) {
      toast.error("사용자 권한 목록 조회 중 오류가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const fetchUserList = async () => {
    try {
      const params = {
        startIndex: pageIndex * pageSize,
        pageIndex,
        pageSize,
        sortColumn: field,
        sortDirection: order,
      };
      const searchParams = new URLSearchParams(params);
      const { data } = await api.get(`/api/admin/users?${searchParams}`);
      const { totalCount, dataList } = data.data;
      setUserInfo({ totalCount, dataList });
    } catch (error) {
      toast.error("사용자 목록 조회 중 오류가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const handleRoleChange = (value) => {
    setRoleId(value);
    fetchUserRoleList(value);
  };

  const handleAddUser = () => {
    const table = userTable.current.getTable();
    const selectedUsers = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    const newUsers = selectedUsers.filter(
      (user) =>
        !userRole.some((existingUser) => existingUser.userId === user.userId)
    );

    setUserRole((prev) => [...prev, ...newUsers]);
  };

  const handleRemoveUser = () => {
    const table = addUserTable.current.getTable();
    const selectedUserIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.userId);

    setUserRole((prev) =>
      prev.filter((user) => !selectedUserIds.includes(user.userId))
    );
    table.resetRowSelection();
  };

  const handleSave = async () => {
    try {
      await api.post(`/api/admin/userRole/${roleId}`, {
        roleId,
        addUserList: userRole.map((user) => user.userId),
        createdBy: user.userId,
      });

      toast.success("저장되었습니다.");
      userTable.current.getTable().resetRowSelection();
      addUserTable.current.getTable().resetRowSelection();
      fetchUserRoleList(roleId);
    } catch (error) {
      toast.error("저장 중 오류가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    fetchRoleList();
    fetchUserList();
  }, []);

  return (
    <div>
      <div className="flex mb-5">
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="권한" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {role.dataList.map((r) => (
                <SelectItem key={r.roleId} value={r.roleId}>
                  {r.roleName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex">
        <div className="w-5/6">
          <DataTable
            ref={userTable}
            columns={columns}
            data={userInfo.dataList}
            totalCount={userInfo.totalCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            sorting={sorting}
            onSortingChange={onSortingChange}
          />
        </div>

        <div className="w-2/6 space-y-4 text-center content-center">
          <div>
            <Button
              variant="outline"
              onClick={handleAddUser}
              disabled={roleId === 0}
            >
              추가 {">>"}
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={handleRemoveUser}
              disabled={roleId === 0}
            >
              {"<<"} 삭제
            </Button>
          </div>
        </div>

        <div className="w-5/6">
          <BasicDataTable
            ref={addUserTable}
            columns={columns}
            data={userRole}
          />
          <div className="flex w-full justify-end pt-4">
            <div className="items-end">
              {roleId > 0 && <Button onClick={handleSave}>저장</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRole;
