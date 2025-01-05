import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import UserForm from "@/components/form/UserForm";
import userFormSchema from "@/components/formSchema/UserFormSchema";

const UserEdit = () => {
  const pageTitle = "사용자관리";
  const navigate = useNavigate();
  const api = useAxios();
  const { toast } = useToast();
  const { userId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const form = useForm({
    resolver: zodResolver(userFormSchema()),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      verifyPassword: "",
    },
  });

  const handleUserFetch = async () => {
    try {
      const { data } = await api.get(`/api/admin/users/${userId}`);
      const userData = data.data;
      Object.entries(userData).forEach(([key, value]) => {
        form.setValue(key, value);
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "사용자 정보 조회 실패",
        description: error.response?.data?.message || "오류가 발생했습니다",
      });
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await api.put(`/api/admin/users/${userId}`, {
        ...formData,
        modifiedBy: user.userId,
      });

      toast({ title: "수정되었습니다." });
      navigate(`/admin/users/${userId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    handleUserFetch();
  }, []);

  return (
    <div className="my-4">
      <PageHeader title={pageTitle} />
      <div className="mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <UserForm form={form} />
            <div className="flex w-full justify-end mt-4">
              <div className="items-end space-x-2">
                <Button type="submit">저장</Button>
                <Button type="button" onClick={() => navigate("/admin/users")}>
                  목록
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserEdit;
