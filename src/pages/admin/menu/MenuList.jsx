import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Tree from "rc-tree";

import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const breadCrumbList = [
    { url: null, name: "관리자" },
    { url: "/admin/menus", name: "메뉴관리" },
  ];

  const user = useSelector((state) => {
    return state.auth.user;
  });

  const api = useAxios();
  const { toast } = useToast();

  const [treeData, setTreeData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const formSchema = menuFormSchema();

  const createForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menuId: "",
      parentMenuId: "",
      menuName: "",
      menuUrl: "",
      sortOrder: "",
      usageStatus: true,
    },
  });

  const modifyForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menuId: "",
      parentMenuId: "",
      menuName: "",
      menuUrl: "",
      sortOrder: "",
      usageStatus: true,
    },
  });

  /**
   * 메뉴 조회
   */
  const retrieveMenus = () => {
    api({
      url: "/api/admin/menus",
      method: "GET",
    }).then((response) => {
      const menus = response.data.data;
      const rcTreeData = getRcTreeData(0, menus);
      const rootData = [
        {
          key: 0,
          title: "메뉴",
          menuId: 0,
          children: rcTreeData,
        },
      ];
      setTreeData(rootData);
    });
  };

  /**
   * 메뉴 상세 조회
   * @param {*} menuId 메뉴 아이디
   */
  const retrieveMenuById = (menuId) => {
    api({
      url: `/api/admin/menus/${menuId}`,
      method: "GET",
    }).then((response) => {
      const menu = response.data.data;
      modifyForm.reset({
        menuId: menu.menuId,
        menuName: menu.menuName,
        parentMenuId: menu.parentMenuId,
        menuUrl: menu.menuUrl,
        sortOrder: menu.sortOrder,
        usageStatus: menu.usageStatus,
      });
    });
  };

  const createMenu = (data) => {
    data.userId = user.userId;
    api({
      url: "/api/admin/menus",
      method: "POST",
      data: data,
    })
      .then(() => {
        toast({
          title: "저장되었습니다.",
        });
        setSelectedMenu("");
        retrieveMenus();
        setDialogOpen(false);
        resetModifyForm();
      })
      .catch((data) => {
        toast({
          variant: "destructive",
          title: "문제가 발생하였습니다.",
          description: data.response.data.message,
        });
      });
  };

  const modifyMenu = (data) => {
    data.userId = user.userId;
    api({
      url: `/api/admin/menus/${data.menuId}`,
      method: "PUT",
      data: data,
    }).then(() => {
      toast({
        title: "수정되었습니다.",
      }).catch((data) => {
        toast({
          variant: "destructive",
          title: "문제가 발생하였습니다.",
          description: data.response.data.message,
        });
      });
    });
  };

  const removeMenu = () => {
    api({
      url: `/api/admin/menus/${selectedMenu}`,
      method: "DELETE",
    })
      .then(() => {
        toast({
          title: "삭제되었습니다.",
        });
        setSelectedMenu("");
        retrieveMenus();
        resetModifyForm();
      })
      .catch((data) => {
        toast({
          variant: "destructive",
          title: "문제가 발생하였습니다.",
          description: data.response.data.message,
        });
      });
  };

  /**
   * RCTree용 JSON 생성 (재귀함수)
   * @param {*} menuId
   * @param {*} menus
   * @returns
   */
  const getRcTreeData = (menuId, menus) => {
    let childArray = [];
    menus.forEach((element) => {
      if (element.parentMenuId === menuId) {
        let treeObject = {
          key: element.menuId,
          title: element.menuName,
          depth: element.depth,
          sortOrder: element.sortOrder,
        };
        if (element.childCount > 0) {
          const childArray = getRcTreeData(element.menuId, menus);
          if (childArray.length > 0) {
            treeObject.children = childArray;
          }
        }
        childArray.push(treeObject);
      }
    });
    return childArray;
  };

  /**
   * RCTree - Select Event
   * @param {*} selectedKeys 선택된 Node 키 목록
   * @param {*} e 이벤트
   */
  const handleRcTree = (selectedKeys, e) => {
    if (e.selected) {
      const menuId = selectedKeys[0];
      setSelectedMenu(menuId);
      if (menuId > 0) {
        retrieveMenuById(menuId);
      }
    } else {
      setSelectedMenu("");
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
      usageStatus: true,
    });
  };

  const setNewMenu = () => {
    createForm.reset({
      menuId: 0,
      parentMenuId: selectedMenu,
      menuName: "",
      menuUrl: "",
      sortOrder: "",
      usageStatus: true,
    });
  };

  useEffect(() => {
    retrieveMenus();
  }, []);

  return (
    <>
      <div className="my-4">
        <PageHeader title="메뉴관리" itemList={breadCrumbList} />
      </div>
      <div className="flex space-x-6">
        <Card className="w-1/4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>메뉴 목록</CardTitle>
              <div>
                {selectedMenu !== "" && (
                  <Dialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    tabIndex="9999"
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        tabIndex="0"
                        onClick={setNewMenu}
                      >
                        추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <Form {...createForm}>
                        <form
                          onSubmit={createForm.handleSubmit(createMenu)}
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
            </div>
          </CardHeader>
          <CardContent>
            {treeData && (
              <Tree
                treeData={treeData}
                onSelect={handleRcTree}
                defaultExpandAll={true}
              />
            )}
          </CardContent>
        </Card>
        <Card className="w-3/4">
          <Form {...modifyForm}>
            <form onSubmit={modifyForm.handleSubmit(modifyMenu)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>메뉴 상세정보</CardTitle>
                  <div className="space-x-2">
                    {selectedMenu > 0 && (
                      <>
                        <Button type="submit">수정</Button>
                        <Button type="button" onClick={removeMenu}>
                          삭제
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <MenuForm form={modifyForm} />
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default MenuList;
