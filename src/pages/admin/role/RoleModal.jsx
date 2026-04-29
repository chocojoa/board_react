import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAuthStore from "@/store/useAuthStore";
import useAxios from "@/hooks/useAxios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  roleName: z.string().min(1, "권한명을 입력해 주세요."),
  description: z.string().default(""),
});

const RoleModal = ({ retrieveRoleList, roleId = 0 }) => {
  const user = useAuthStore((state) => state.user);
  const api = useAxios();
  const [dialogOpen, setDialogOpen] = useState(false);
  const isCreate = roleId === 0;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { roleName: "", description: "" },
  });

  const handleOpen = async () => {
    if (!isCreate) {
      try {
        const { data } = await api.get(`/api/admin/roles/${roleId}`);
        form.reset({ roleName: data.data.roleName, description: data.data.description ?? "" });
      } catch (error) {
        toast.error("조회 중 오류가 발생했습니다.", {
          description: error.response?.data?.message,
        });
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values, userId: user.userId };
      if (isCreate) {
        await api.post("/api/admin/roles", payload);
        toast.success("저장되었습니다.");
      } else {
        await api.put(`/api/admin/roles/${roleId}`, payload);
        toast.success("수정되었습니다.");
      }
      form.reset();
      setDialogOpen(false);
      retrieveRoleList();
    } catch (error) {
      toast.error("오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/api/admin/roles/${roleId}`);
      toast.success("삭제되었습니다.");
      form.reset();
      setDialogOpen(false);
      retrieveRoleList();
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {isCreate ? (
          <Button variant="outline">등록</Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-1"
            onClick={handleOpen}
          >
            수정
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{isCreate ? "권한 추가" : "권한 수정"}</DialogTitle>
              <DialogDescription />
            </DialogHeader>

            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>권한명</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="권한명을 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="설명을 입력하세요" />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                취소
              </Button>
              {!isCreate && (
                <Button type="button" variant="destructive" onClick={handleRemove}>
                  삭제
                </Button>
              )}
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
