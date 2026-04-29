import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";

import { toast } from "sonner";
import useAxios from "@/hooks/useAxios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import MenuCheckTree from "./MenuCheckTree";

const MenuRole = () => {
  const user = useAuthStore((state) => state.user);
  const api = useAxios();

  const [roleId, setRoleId] = useState(0);
  const [roles, setRoles] = useState({ totalCount: 0, dataList: [] });
  const [treeData, setTreeData] = useState([]);
  const [checkedMenuIds, setCheckedMenuIds] = useState([]);

  const buildTree = (parentId, menuList) => {
    return menuList
      .filter((m) => m.parentMenuId === parentId)
      .map((m) => ({ ...m, children: buildTree(m.menuId, menuList) }));
  };

  const getAllDescendantIds = (node) => {
    const ids = [node.menuId];
    if (node.children?.length) {
      for (const child of node.children) {
        ids.push(...getAllDescendantIds(child));
      }
    }
    return ids;
  };

  const collectHalfCheckedIds = (nodes, checked) => {
    const result = [];
    for (const node of nodes) {
      if (node.children?.length) {
        const allIds = getAllDescendantIds(node);
        const checkedCount = allIds.filter((id) => checked.includes(id)).length;
        if (checkedCount > 0 && checkedCount < allIds.length) {
          result.push(node.menuId);
        }
        result.push(...collectHalfCheckedIds(node.children, checked));
      }
    }
    return result;
  };

  const retrieveRoles = async () => {
    try {
      const { data } = await api.get("/api/admin/roles?sortColumn=roleName");
      const { totalCount, dataList } = data.data;
      setRoles({ totalCount, dataList });
    } catch (error) {
      toast.error("문제가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const retrieveMenuRoles = async (selectedRoleId) => {
    try {
      const { data } = await api.get(`/api/admin/menuRole/${selectedRoleId}`);
      const menuList = data.data;

      const checked = menuList.filter((m) => m.checked).map((m) => m.menuId);
      setCheckedMenuIds(checked);
      setTreeData(buildTree(0, menuList));
    } catch (error) {
      toast.error("문제가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const handleRoleChange = (value) => {
    setRoleId(value);
    setTreeData([]);
    setCheckedMenuIds([]);
    retrieveMenuRoles(value);
  };

  const handleSave = async () => {
    try {
      const halfCheckedIds = collectHalfCheckedIds(treeData, checkedMenuIds);
      await api.post(`/api/admin/menuRole/${roleId}`, {
        roleId,
        addMenuList: [...checkedMenuIds, ...halfCheckedIds],
        createdBy: user.userId,
      });
      toast.success("저장되었습니다.");
    } catch (error) {
      toast.error("문제가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    retrieveRoles();
  }, []);

  return (
    <div>
      <div className="flex mb-5">
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="권한을 선택해 주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.dataList.map((role) => (
                <SelectItem key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="mt-6">
          {treeData.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              권한을 선택해 주세요
            </div>
          ) : (
            <MenuCheckTree
              nodes={treeData}
              checked={checkedMenuIds}
              onChange={setCheckedMenuIds}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex w-full justify-end pt-4">
        {roleId > 0 && <Button onClick={handleSave}>저장</Button>}
      </div>
    </div>
  );
};

export default MenuRole;
