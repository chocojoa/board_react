import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { toast } from "sonner";
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

const RoleModal = ({ retrieveRoleList, roleId = 0 }) => {
  const user = useSelector((state) => state.auth.user);
  const api = useAxios();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isCreate = roleId === 0;
  const dialogTitle = isCreate ? "권한 추가" : "권한 수정";

  const form = useForm({
    resolver: zodResolver(roleFormSchema()),
    defaultValues: {
      roleId: "",
      roleName: "",
      description: "",
    },
  });

  const handleSubmit = async (data) => {
    try {
      const payload = { ...data, userId: user.userId };

      if (isCreate) {
        await api.post("/api/admin/roles", payload);
        toast.success("저장되었습니다.");
      } else {
        await api.put(`/api/admin/roles/${roleId}`, payload);
        toast.success("수정되었습니다.");
      }

      resetModal();
    } catch (error) {
      toast.error("오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const handleRetrieve = async () => {
    try {
      const response = await api.get(`/api/admin/roles/${roleId}`);
      const role = response.data.data;
      form.reset({
        roleId: role.roleId,
        roleName: role.roleName,
        description: role.description,
      });
    } catch (error) {
      toast.error("조회 중 오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/api/admin/roles/${roleId}`);
      toast.success("삭제되었습니다.");
      resetModal();
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const resetModal = () => {
    form.reset();
    setDialogOpen(false);
    retrieveRoleList();
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {isCreate ? (
            <Button type="button" variant="outline">
              등록
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="px-3 py-1"
              onClick={handleRetrieve}
            >
              수정
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription />
              </DialogHeader>

              <RoleForm form={form} />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  취소
                </Button>
                {!isCreate && (
                  <Button type="button" onClick={handleRemove}>
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

export default RoleModal;
