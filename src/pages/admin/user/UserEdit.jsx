import { useEffect, useState } from "react";
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
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const [breadcrumbs, setBreadcrumbs] = useState([]);

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
   * 사용자 조회
   */
  const retrieveUser = () => {
    api({
      url: `/api/admin/users/${userId}`,
      method: "GET",
    }).then((response) => {
      const post = response.data.data;
      Object.keys(post).map((key) => {
        form.setValue(key, post[key]);
      });
    });
  };

  /**
   * 사용자 정보 수정
   * @param {*} data form data
   */
  const onSubmit = (data) => {
    api({
      url: `/api/admin/users/${userId}`,
      method: "PUT",
      data: {
        userName: data.userName,
        email: data.email,
        password: data.password,
        verifyPassword: data.verifyPassword,
        modifiedBy: user.userId,
      },
    })
      .then(() => {
        toast({
          title: "수정되었습니다.",
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
    retrieveUser();
    retrieveBreadcrumbs();
  }, []);

  return (
    <div className="my-4">
      {breadcrumbs.length > 0 && (
        <PageHeader title="사용자관리" itemList={breadcrumbs} />
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

export default UserEdit;
