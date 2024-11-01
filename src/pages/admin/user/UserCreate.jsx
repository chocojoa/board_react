import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import userFormSchema from "@/components/formSchema/UserFormSchema";
import UserForm from "@/components/form/UserForm";

const UserCreate = () => {
  const navigate = useNavigate();
  const api = useAxios();
  const { toast } = useToast();

  const user = useSelector((state) => {
    return state.auth.user;
  });

  const breadCrumbList = [{ url: `/admin/users`, name: `사용자관리` }];

  const gotoDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const gotoList = () => {
    navigate(`/admin/users`);
  };

  const formSchema = userFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      verifyPassword: "",
    },
  });

  const onSubmit = (data) => {
    api({
      url: `/api/admin/users`,
      method: "POST",
      data: {
        userName: data.userName,
        email: data.email,
        password: data.password,
        verifyPassword: data.verifyPassword,
        createdBy: user.userId,
      },
    })
      .then((response) => {
        const userId = response.data.data.userId;
        toast({
          title: "저장되었습니다.",
        });
        gotoDetail(userId);
      })
      .catch((data) => {
        toast({
          variant: "destructive",
          title: "문제가 발생하였습니다.",
          description: data.response.data.message,
        });
      });
  };

  return (
    <>
      <PageHeader title="사용자관리" itemList={breadCrumbList} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <UserForm form={form} />
          <div className="flex w-full justify-end mt-4">
            <div className="items-end space-x-2">
              <Button type="submit">저장</Button>
              <Button type="button" onClick={gotoList}>
                목록
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserCreate;
