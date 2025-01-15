import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Tree from "rc-tree";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";
import menuFormSchema from "@/components/formSchema/MenuFormSchema";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import MenuForm from "@/components/form/MenuForm";

import "rc-tree/assets/index.css";

const MenuList = () => {
  const pageTitle = "메뉴관리";
  const user = useSelector((state) => state.auth.user);
  const api = useAxios();
  const { toast } = useToast();

  const [treeData, setTreeData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formSchema = menuFormSchema();
  const defaultFormValues = {
    menuId: 0,
    parentMenuId: 0,
    menuName: "",
    menuUrl: "",
    sortOrder: "",
    icon: "",
    usageStatus: true,
  };
  const createForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const modifyForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const buildTreeData = (menuId, menus) => {
    return menus
      .filter((menu) => menu.parentMenuId === menuId)
      .map((menu) => {
        const node = {
          key: menu.menuId,
          title: menu.menuName,
          depth: menu.depth,
          sortOrder: menu.sortOrder,
          menuId: menu.menuId,
          parentMenuId: menu.parentMenuId,
        };

        if (menu.childCount > 0) {
          const children = buildTreeData(menu.menuId, menus);
          if (children.length) {
            node.children = children;
          }
        }

        return node;
      });
  };

  const retrieveMenus = async () => {
    try {
      const response = await api.get("/api/admin/menus");
      const menus = response.data.data;
      const treeNodes = buildTreeData(0, menus);
      setTreeData([
        {
          key: 0,
          title: "메뉴",
          menuId: 0,
          parentMenuId: 0,
          children: treeNodes,
        },
      ]);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const retrieveMenuById = async (menuId) => {
    try {
      const response = await api.get(`/api/admin/menus/${menuId}`);
      const menu = response.data.data;
      modifyForm.reset(menu);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleCreateMenu = async (data) => {
    try {
      await api.post("/api/admin/menus", { ...data, userId: user.userId });
      showSuccessToast("저장되었습니다.");
      handleMenuChange();
      setDialogOpen(false);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleModifyMenu = async (data) => {
    try {
      await api.put(`/api/admin/menus/${data.menuId}`, {
        ...data,
        userId: user.userId,
      });
      showSuccessToast("수정되었습니다.");
      handleMenuChange();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleRemoveMenu = async () => {
    try {
      await api.delete(`/api/admin/menus/${selectedMenu}`);
      showSuccessToast("삭제되었습니다.");
      handleMenuChange();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleMenuChange = () => {
    setSelectedMenu(-1);
    retrieveMenus();
    resetModifyForm();
  };

  const handleTreeSelect = (selectedKeys, e) => {
    if (e.selected) {
      const menuId = selectedKeys[0];
      setSelectedMenu(menuId);
      if (menuId > 0) {
        retrieveMenuById(menuId);
      }
    } else {
      setSelectedMenu(-1);
      resetModifyForm();
    }
  };

  const resetModifyForm = () => {
    modifyForm.reset({
      menuId: 0,
      parentMenuId: selectedMenu,
      menuName: "",
      menuUrl: "",
      sortOrder: "",
      icon: "",
      usageStatus: true,
    });
  };

  const initNewMenu = () => {
    createForm.reset({
      menuId: 0,
      parentMenuId: selectedMenu,
      menuName: "",
      menuUrl: "",
      sortOrder: "",
      icon: "",
      usageStatus: true,
    });
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

  // menuId를 기준으로 객체를 삭제하는 함수
  const deleteMenuById = (array, menuId) => {
    return array.filter((item) => {
      if (item.children && item.children.length > 0) {
        item.children = deleteMenuById(item.children, menuId);
      }
      return item.menuId !== menuId;
    });
  };

  // 특정 위치에 메뉴를 삽입하는 함수
  const insertMenuById = (array, parentId, newMenu) => {
    return array.map((item) => {
      if (item.menuId === parentId) {
        // 부모를 찾았으면 children에 삽입
        return {
          ...item,
          children: [...item.children, newMenu],
        };
      }

      // 재귀적으로 children에서 부모를 찾음
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: insertMenuById(item.children, parentId, newMenu),
        };
      }

      return item;
    });
  };

  const handleTreeDrop = (event) => {
    const menuId = event.dragNode.menuId;

    const moveMenu = {
      key: event.dragNode.key,
      title: event.dragNode.title,
      depth: event.dragNode.depth,
      sortOrder: event.node.sortOrder + 1,
      menuId: event.dragNode.menuId,
      parentMenuId: event.node.parentMenuId,
    };

    const newParentMenuId = event.node.parentMenuId;
    const dropMenuWithoutArray = deleteMenuById(treeData, menuId);
    const newTreeData = insertMenuById(
      dropMenuWithoutArray,
      newParentMenuId,
      moveMenu
    );
    modifyMenu(moveMenu);
    setTreeData(newTreeData);
  };

  const modifyMenu = async (data) => {
    try {
      await api.put(`/api/admin/menus/${data.menuId}`, {
        ...data,
        userId: user.userId,
      });
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    retrieveMenus();
  }, []);

  return (
    <div className="my-4">
      <PageHeader title={pageTitle} />
      <div className="flex space-x-6 mt-4">
        <Card className="w-1/4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>메뉴 목록</CardTitle>
              {selectedMenu > -1 && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={initNewMenu}>
                      추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <Form {...createForm}>
                      <form
                        onSubmit={createForm.handleSubmit(handleCreateMenu)}
                        className="space-y-4"
                      >
                        <DialogHeader>
                          <DialogTitle>메뉴 추가</DialogTitle>
                          <DialogDescription>
                            선택한 메뉴의 하위메뉴로 생성됩니다.
                          </DialogDescription>
                        </DialogHeader>
                        <MenuForm form={createForm} />
                        <DialogFooter>
                          <Button type="submit">저장</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {treeData.length > 0 && (
              <Tree
                treeData={treeData}
                onSelect={handleTreeSelect}
                defaultExpandAll={true}
                draggable
                onDrop={handleTreeDrop}
              />
            )}
            {treeData.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">메뉴가 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-3/4">
          <Form {...modifyForm}>
            <form onSubmit={modifyForm.handleSubmit(handleModifyMenu)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>메뉴 상세정보</CardTitle>
                  {selectedMenu && (
                    <div className="space-x-2">
                      <Button type="submit">수정</Button>
                      <Button type="button" onClick={handleRemoveMenu}>
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <MenuForm form={modifyForm} />
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default MenuList;
