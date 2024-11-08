import { useEffect, useState } from "react";
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
  const pageTitle = "사용자관리";

  const navigate = useNavigate();

  const api = useAxios();
  const { toast } = useToast();

  const user = useSelector((state) => {
    return state.auth.user;
  });

  const [breadCrumbs, setBreadcrumbs] = useState([]);

  /**
   * 네비게이션 조회
   */
  const retrieveBreadcrumbs = () => {
    const url = `/api/admin/menus/breadcrumbs?menuName=${pageTitle}`;
    api({
      url: encodeURI(url),
      method: "GET",
    }).then((response) => {
      setBreadcrumbs(response.data.data);
    });
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

  /**
   * 사용자 저장
   * @param {*} data form data
   */
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

  /**
   * 상세화면으로 이동
   * @param {*} userId 사용자 아이디
   */
  const gotoDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  /**
   * 목록화면으로 이동
   */
  const gotoList = () => {
    navigate(`/admin/users`);
  };

  useEffect(() => {
    retrieveBreadcrumbs();
  }, []);

  return (
    <div className="py-4">
      {breadCrumbs.length > 0 && (
        <PageHeader title={pageTitle} itemList={breadCrumbs} />
      )}
      <div className="mt-2">
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
      </div>
    </div>
  );
};

export default UserCreate;
