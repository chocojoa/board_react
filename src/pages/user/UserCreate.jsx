import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import userFormSchema from "@/components/formSchema/UserFormSchema";
import UserForm from "@/components/form/UserForm";

const UserCreate = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const user = useSelector((state) => {
    return state.auth.user;
  });

  const breadCrumbList = [{ url: `/users`, name: `사용자` }];

  const gotoDetail = (userId) => {
    navigate(`/users/${userId}`);
  };

  const gotoList = () => {
    navigate(`/users`);
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
      url: `/api/users`,
      method: "POST",
      data: {
        userName: data.title,
        email: data.content,
        password: data.password,
        verifyPassword: data.verifyPassword,
        userId: user.userId,
      },
    }).then((response) => {
      const userId = response.data.data.userId;
      Swal.fire({
        icon: "success",
        title: "저장되었습니다.",
        timer: 2000,
      }).then(() => {
        gotoDetail(userId);
      });
    });
  };

  return (
    <>
      <PageHeader title="사용자" itemList={breadCrumbList} />
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
