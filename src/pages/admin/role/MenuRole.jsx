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

const MenuRole = () => {
  const user = useSelector((state) => state.auth.user);

  const api = useAxios();
  const { toast } = useToast();

  const [roleId, setRoleId] = useState(0);
  const [role, setRole] = useState({ totalCount: 0, dataList: [] });
  const [treeData, setTreeData] = useState(null);

  const [checkedKeys, setCheckedKeys] = useState(null);

  const treeRef = useRef();

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
    retrieveMenuRoleList(value);
  };

  const retrieveMenuRoleList = (roleId) => {
    api({
      url: `/api/admin/menuRole/${roleId}`,
      method: "GET",
    }).then((response) => {
      const menuList = response.data.data;
      setCheckedKeys(getCheckedTreeList(menuList));

      const reTreeData = getRcTreeData(0, menuList);
      const rootData = [
        {
          key: 0,
          title: "메뉴",
          menuId: 0,
          checkable: false,
          children: reTreeData,
        },
      ];
      setTreeData(rootData);
    });
  };

  const getRcTreeData = (menuId, menuList) => {
    let childArray = [];
    menuList.forEach((element) => {
      if (element.parentMenuId === menuId) {
        let treeObject = {
          key: element.menuId,
          title: element.menuName,
          depth: element.depth,
          sortOrder: element.sortOrder,
        };
        if (element.childCount > 0) {
          const childArray = getRcTreeData(element.menuId, menuList);
          if (childArray.length > 0) {
            treeObject.children = childArray;
          }
        }
        childArray.push(treeObject);
      }
    });
    return childArray;
  };

  const getCheckedTreeList = (menuList) => {
    let checkedKeys = [];
    let halfCheckedKeys = [];
    menuList.forEach((m) => {
      if (m.checked) {
        checkedKeys.push(m.menuId);
      }
      if (m.halfChecked) {
        halfCheckedKeys.push(m.menuId);
      }
    });
    return { checked: checkedKeys, halfCheckedKeys: halfCheckedKeys };
  };

  const createMenuRole = () => {
    api({
      url: `/api/admin/menuRole/${roleId}`,
      method: "POST",
      data: {
        roleId: roleId,
        addMenuList: [...checkedKeys.checked, ...checkedKeys.halfCheckedKeys],
        createdBy: user.userId,
      },
    }).then(() => {
      toast({
        title: "저장되었습니다.",
      });
    });
  };

  const handleRcTree = (checkedKeys, e) => {
    setCheckedKeys({
      checked: checkedKeys,
      halfCheckedKeys: e.halfCheckedKeys,
    });
  };

  useEffect(() => {
    retrieveRoleList();
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
      <div>
        <Card>
          <CardContent className="mt-6">
            {treeData && (
              <Tree
                ref={treeRef}
                treeData={treeData}
                checkable={true}
                defaultExpandAll={true}
                checkedKeys={checkedKeys}
                onCheck={(checkedKeys, e) => handleRcTree(checkedKeys, e)}
              />
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-end pt-4">
        <div className="items-end">
          {roleId > 0 && <Button onClick={createMenuRole}>저장</Button>}
        </div>
      </div>
    </div>
  );
};

export default MenuRole;
