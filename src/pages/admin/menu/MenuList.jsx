import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { toast } from "sonner";
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
import MenuTreeNode from "./MenuTreeNode";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MenuList = () => {
  const pageTitle = "메뉴관리";
  const user = useAuthStore((state) => state.user);
  const api = useAxios();

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
    isDisplayed: true,
  };

  const createForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const modifyForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const buildTree = (parentId, menus) => {
    return menus
      .filter((m) => m.parentMenuId === parentId)
      .map((m) => ({ ...m, children: buildTree(m.menuId, menus) }));
  };

  const retrieveMenus = async () => {
    try {
      const { data } = await api.get("/api/admin/menus");
      const menus = data.data;
      setTreeData([
        { menuId: 0, menuName: "메뉴", parentMenuId: 0, children: buildTree(0, menus) },
      ]);
    } catch (error) {
      toast.error("문제가 발생하였습니다.", { description: error.response?.data?.message });
    }
  };

  const retrieveMenuById = async (menuId) => {
    try {
      const { data } = await api.get(`/api/admin/menus/${menuId}`);
      modifyForm.reset(data.data);
    } catch (error) {
      toast.error("문제가 발생하였습니다.", { description: error.response?.data?.message });
    }
  };

  const handleCreateMenu = async (data) => {
    try {
      await api.post("/api/admin/menus", { ...data, userId: user.userId });
      toast.success("저장되었습니다.");
      handleMenuChange();
      setDialogOpen(false);
    } catch (error) {
      toast.error("문제가 발생하였습니다.", { description: error.response?.data?.message });
    }
  };

  const handleModifyMenu = async (data) => {
    try {
      await api.put(`/api/admin/menus/${data.menuId}`, { ...data, userId: user.userId });
      toast.success("수정되었습니다.");
      handleMenuChange();
    } catch (error) {
      toast.error("문제가 발생하였습니다.", { description: error.response?.data?.message });
    }
  };

  const handleRemoveMenu = async () => {
    try {
      await api.delete(`/api/admin/menus/${selectedMenu}`);
      toast.success("삭제되었습니다.");
      handleMenuChange();
    } catch (error) {
      toast.error("문제가 발생하였습니다.", { description: error.response?.data?.message });
    }
  };

  const handleMenuChange = () => {
    setSelectedMenu(-1);
    retrieveMenus();
    resetModifyForm();
  };

  const handleTreeSelect = (menuId) => {
    if (selectedMenu === menuId) {
      setSelectedMenu(-1);
      resetModifyForm();
    } else {
      setSelectedMenu(menuId);
      if (menuId > 0) {
        retrieveMenuById(menuId);
      }
    }
  };

  const resetModifyForm = () => {
    modifyForm.reset({
      ...defaultFormValues,
      parentMenuId: selectedMenu > 0 ? selectedMenu : 0,
    });
  };

  const initNewMenu = () => {
    createForm.reset({
      ...defaultFormValues,
      parentMenuId: selectedMenu,
    });
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
            {treeData.length > 0 ? (
              <div>
                {treeData.map((node) => (
                  <MenuTreeNode
                    key={node.menuId}
                    node={node}
                    selectedMenuId={selectedMenu}
                    onSelect={handleTreeSelect}
                  />
                ))}
              </div>
            ) : (
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
                  {selectedMenu > 0 && (
                    <div className="space-x-2">
                      <Button type="submit">수정</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">삭제</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>삭제하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>
                              삭제 시 하위 메뉴까지 삭제됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveMenu}>
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
