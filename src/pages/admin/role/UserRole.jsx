import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useToast } from "@/hooks/use-toast";
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
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const api = useAxios();
  const { toast } = useToast();

  const [role, setRole] = useState({ totalCount: 0, dataList: [] });
  const [userInfo, setUserInfo] = useState({ totalCount: 0, dataList: [] });
  const [userRole, setUserRole] = useState([]);
  const [roleId, setRoleId] = useState(0);

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

  const { pageIndex, pageSize, onPaginationChange, pagination } =
    usePagination();
  const { sorting, onSortingChange, field, order } = useSorting(
    "userName",
    "ASC"
  );

  const retrieveRoleList = () => {
    api({
      url: "/api/admin/roles?sortColumn=roleName",
      method: "GET",
    }).then((response) => {
      const roleInfo = response.data.data;
      setRole({
        totalCount: roleInfo.totalCount,
        dataList: roleInfo.dataList,
      });
    });
  };

  const handleRoleId = (value) => {
    setRoleId(value);
    retrieveUserRoleList(value);
  };

  const retrieveUserRoleList = (roleId) => {
    api({
      url: `/api/admin/userRole/${roleId}`,
      method: "GET",
    }).then((response) => {
      const userRoleInfo = response.data.data;
      setUserRole(userRoleInfo);
    });
  };

  const retrieveUserList = () => {
    const paramObj = {
      startIndex: pageIndex * pageSize,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortColumn: field,
      sortDirection: order,
    };
    const searchParams = new URLSearchParams(paramObj);
    api({
      url: `/api/admin/users?${searchParams}`,
      method: "GET",
    }).then((response) => {
      const userInfo = response.data.data;
      setUserInfo({
        totalCount: userInfo.totalCount,
        dataList: userInfo.dataList,
      });
    });
  };

  const userTable = useRef();
  const addUserTable = useRef();

  const addUser = () => {
    const table = userTable.current.getTable();
    const selectedRows = table.getSelectedRowModel().rows;
    const userIdArray = selectedRows.map((row) => row.original.userId);
    const userArray = selectedRows.map((row) => row.original);

    const duplicateArray = [];
    for (let i = 0; i < userIdArray.length; i++) {
      const userId = userIdArray[i];
      for (let j = 0; j < userRole.length; j++) {
        if (userRole[j].userId === userId) {
          duplicateArray.push(userRole[j]);
          break;
        }
      }
    }
    const newUserArray = userArray.filter(
      (u) => !duplicateArray.map((du) => du.userId).includes(u.userId)
    );
    setUserRole((prev) => [...prev, ...newUserArray]);
  };

  const removeUser = () => {
    const table = addUserTable.current.getTable();
    const selectedRows = table.getSelectedRowModel().rows;
    const userArray = selectedRows.map((row) => row.original);

    const newUserArray = userRole.filter(
      (u) => !userArray.map((su) => su.userId).includes(u.userId)
    );
    setUserRole([...newUserArray]);
    table.resetRowSelection();
  };

  const getUserList = (userArray = []) => {
    return userArray.map((u) => u.userId);
  };

  const createUserRole = () => {
    api({
      url: `/api/admin/userRole/${roleId}`,
      method: "POST",
      data: {
        roleId: roleId,
        addUserList: getUserList(userRole),
        createdBy: user.userId,
      },
    }).then(() => {
      toast({
        title: "저장되었습니다.",
      });
      userTable.current.getTable().resetRowSelection();
      addUserTable.current.getTable().resetRowSelection();
      retrieveUserRoleList(roleId);
    });
  };

  useEffect(() => {
    retrieveRoleList();
    retrieveUserList();
  }, []);

  return (
    <div>
      <div className="flex mb-5">
        <Select onValueChange={(value) => handleRoleId(value)}>
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
            <Button variant="outline" onClick={addUser}>
              추가 {">>"}
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={removeUser}>
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
              {roleId > 0 && <Button onClick={createUserRole}>저장</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRole;
