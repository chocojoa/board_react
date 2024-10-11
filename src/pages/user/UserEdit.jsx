import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import UserForm from "@/components/form/UserForm";
import userFormSchema from "@/components/formSchema/UserFormSchema";

const UserEdit = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { userId } = useParams();
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const breadCrumbList = [{ url: `/users`, name: `자유게시판` }];

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

  const retrieveUser = () => {
    api({
      url: `/api/users/${userId}`,
      method: "GET",
    }).then((response) => {
      const post = response.data.data;
      Object.keys(post).map((key) => {
        form.setValue(key, post[key]);
      });
    });
  };

  const onSubmit = (data) => {
    api({
      url: `/api/users/${userId}`,
      method: "PUT",
      data: {
        userName: data.userName,
        email: data.email,
        password: data.password,
        verifyPassword: data.verifyPassword,
        userId: user.userId,
      },
    }).then(() => {
      Swal.fire({
        icon: "success",
        title: "수정되었습니다.",
        timer: 2000,
      }).then(() => {
        gotoDetail(userId);
      });
    });
  };

  useEffect(() => {
    retrieveUser();
  }, []);

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

export default UserEdit;
