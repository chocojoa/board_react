import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useToast } from "@/hooks/use-toast";
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

import Tree from "rc-tree";
import "rc-tree/assets/index.css";

const MenuRole = () => {
  const user = useSelector((state) => state.auth.user);
  const api = useAxios();
  const { toast } = useToast();
  const treeRef = useRef();

  const [roleId, setRoleId] = useState(0);
  const [roles, setRoles] = useState({ totalCount: 0, dataList: [] });
  const [treeData, setTreeData] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState(null);

  const buildTreeData = (menuId, menuList) => {
    return menuList
      .filter((menu) => menu.parentMenuId === menuId)
      .map((menu) => {
        const node = {
          key: menu.menuId,
          title: menu.menuName,
          depth: menu.depth,
          sortOrder: menu.sortOrder,
        };

        if (menu.childCount > 0) {
          const children = buildTreeData(menu.menuId, menuList);
          if (children.length) {
            node.children = children;
          }
        }

        return node;
      });
  };

  const getCheckedKeys = (menuList) => {
    const checked = [];
    const halfChecked = [];

    menuList.forEach((menu) => {
      if (menu.checked) checked.push(menu.menuId);
      if (menu.halfChecked) halfChecked.push(menu.menuId);
    });

    return { checked, halfCheckedKeys: halfChecked };
  };

  const retrieveRoles = async () => {
    try {
      const response = await api.get("/api/admin/roles?sortColumn=roleName");
      const { totalCount, dataList } = response.data.data;
      setRoles({ totalCount, dataList });
    } catch (error) {
      showErrorToast(error);
    }
  };

  const retrieveMenuRoles = async (selectedRoleId) => {
    try {
      const response = await api.get(`/api/admin/menuRole/${selectedRoleId}`);
      const menuList = response.data.data;

      setCheckedKeys(getCheckedKeys(menuList));

      const treeNodes = buildTreeData(0, menuList);
      setTreeData([
        {
          key: 0,
          title: "메뉴",
          menuId: 0,
          checkable: false,
          children: treeNodes,
        },
      ]);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleRoleChange = (value) => {
    setRoleId(value);
    retrieveMenuRoles(value);
  };

  const handleTreeCheck = (checkedKeys, e) => {
    setCheckedKeys({
      checked: checkedKeys,
      halfCheckedKeys: e.halfCheckedKeys,
    });
  };

  const handleSave = async () => {
    try {
      await api.post(`/api/admin/menuRole/${roleId}`, {
        roleId,
        addMenuList: [...checkedKeys.checked, ...checkedKeys.halfCheckedKeys],
        createdBy: user.userId,
      });
      showSuccessToast("저장되었습니다.");
    } catch (error) {
      showErrorToast(error);
    }
  };

  const showSuccessToast = (message) => {
    toast({ title: message });
  };

  const showErrorToast = (error) => {
    toast({
      variant: "destructive",
      title: "문제가 발생하였습니다.",
      description: error.response?.data?.message,
    });
  };

  useEffect(() => {
    retrieveRoles();
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
          {treeData && (
            <Tree
              ref={treeRef}
              treeData={treeData}
              checkable={true}
              defaultExpandAll={true}
              checkedKeys={checkedKeys}
              onCheck={handleTreeCheck}
            />
          )}
          {treeData === null && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">권한을 선택해 주세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex w-full justify-end pt-4">
        <div className="items-end">
          {roleId > 0 && <Button onClick={handleSave}>저장</Button>}
        </div>
      </div>
    </div>
  );
};

export default MenuRole;
