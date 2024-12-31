import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import useAxios from "@/hooks/useAxios";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import RoleForm from "@/components/form/RoleForm";
import roleFormSchema from "@/components/formSchema/RoleFormSchema";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const RoleModel = ({ retrieveRoleList, roleId = 0 }) => {
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const api = useAxios();
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogTitle = roleId === 0 ? "권한 추가" : "권한 수정";

  const formSchema = roleFormSchema();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: "",
      roleName: "",
      description: "",
    },
  });

  /**
   * form submit
   * @param {*} data form data
   */
  const onSubmit = (data) => {
    if (roleId === 0) {
      createRole(data);
    } else {
      modifyRole(data);
    }
  };

  /**
   * 권한조회
   */
  const retrieveRole = () => {
    api({
      url: `/api/admin/roles/${roleId}`,
      method: "GET",
    }).then((response) => {
      const role = response.data.data;
      form.reset({
        roleId: role.roleId,
        roleName: role.roleName,
        description: role.description,
      });
    });
  };

  /**
   * 권한생성
   * @param {*} data form data
   */
  const createRole = (data) => {
    data.userId = user.userId;
    api({
      url: `/api/admin/roles`,
      method: "POST",
      data: data,
    }).then(() => {
      toast({
        title: "저장되었습니다.",
      });
      resetModal();
    });
  };

  /**
   * 권한수정
   * @param {*} data form data
   */
  const modifyRole = (data) => {
    data.userId = user.userId;
    api({
      url: `/api/admin/roles/${roleId}`,
      method: "PUT",
      data: data,
    }).then(() => {
      toast({
        title: "수정되었습니다.",
      });
      resetModal();
    });
  };

  /**
   * 권한삭제
   * @param {*} data form data
   */
  const removeRole = (data) => {
    data.userId = user.userId;
    api({
      url: `/api/admin/roles/${roleId}`,
      method: "DELETE",
    }).then(() => {
      toast({
        title: "삭제되었습니다.",
      });
      resetModal();
    });
  };

  /**
   * 모달창 초기화
   */
  const resetModal = () => {
    form.reset();
    setDialogOpen(false);
    retrieveRoleList();
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} tabIndex="9999">
        {roleId === 0 && (
          <DialogTrigger asChild>
            <Button type="button" variant="outline" tabIndex="0">
              등록
            </Button>
          </DialogTrigger>
        )}
        {roleId > 0 && (
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              tabIndex="0"
              size="xs"
              className="px-3 py-1"
              onClick={retrieveRole}
            >
              수정
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[600px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <RoleForm form={form} />
              <DialogFooter>
                {roleId > 0 && (
                  <Button type="button" onClick={removeRole}>
                    삭제
                  </Button>
                )}
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleModel;
