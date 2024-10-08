import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

  const formSchema = z.object({
    userName: z
      .string()
      .trim()
      .min(1, { message: "이름이 입력되지 않았습니다." }),
    email: z
      .string()
      .trim()
      .min(1, { message: "이메일 주소가 입력되지 않았습니다." }),
    password: z
      .string()
      .trim()
      .min(8, { message: "비밀번호는 8자 이상입니다." })
      .max(15, { message: "비밀번호는 15자 이하 입니다." }),
    verifyPassword: z
      .string()
      .trim()
      .min(8, { message: "비밀번호는 8자 이상입니다." })
      .max(15, { message: "비밀번호는 15자 이하 입니다." }),
  });

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
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일 주소</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="flex w-full justify-end mt-4">
            <div className="items-end space-x-2">
              <Button type="submit">저장</Button>
              <Button onClick={gotoList}>목록</Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserEdit;
