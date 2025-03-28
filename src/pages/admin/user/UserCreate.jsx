import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { toast } from "sonner";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import userFormSchema from "@/components/formSchema/UserFormSchema";
import UserForm from "@/components/form/UserForm";

const UserCreate = () => {
  const pageTitle = "사용자관리";
  const navigate = useNavigate();
  const api = useAxios();
  const { userId: createdBy } = useSelector((state) => state.auth.user);

  const form = useForm({
    resolver: zodResolver(userFormSchema()),
    defaultValues: {
      userName: "",
      email: "",
      isPasswordChange: true,
      password: "",
      verifyPassword: "",
    },
  });

  const handleSubmit = async (formData) => {
    try {
      const { data } = await api.post("/api/admin/users", {
        ...formData,
        createdBy,
      });

      toast.success("저장되었습니다.");
      navigate(`/admin/users/${data.data.userId}`);
    } catch (error) {
      toast.error("저장 도중 문제가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  return (
    <div className="py-4">
      <PageHeader title={pageTitle} />
      <div className="mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <UserForm form={form} isNew={true} />
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

export default UserCreate;
