import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const PostCreate = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { categoryId } = useParams();
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const breadCrumbList = [
    { url: `/boards/${categoryId}/posts`, name: `자유게시판` },
  ];

  const gotoDetail = (postId) => {
    navigate(`/boards/${categoryId}/posts/${postId}`);
  };

  const gotoList = () => {
    navigate(`/boards/${categoryId}/posts`);
  };

  const formSchema = z.object({
    title: z.string().trim().min(1, { message: "제목이 입력되지 않았습니다." }),
    content: z
      .string()
      .trim()
      .min(1, { message: "내용이 입력되지 않았습니다." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data) => {
    api({
      url: `/api/boards/${categoryId}/posts`,
      method: "POST",
      data: {
        title: data.title,
        content: data.content,
        userId: user.userId,
      },
    }).then((response) => {
      const postId = response.data.data.postId;
      Swal.fire({
        icon: "success",
        title: "저장되었습니다.",
        timer: 2000,
      }).then(() => {
        gotoDetail(postId);
      });
    });
  };

  return (
    <>
      <PageHeader title="자유게시판" itemList={breadCrumbList} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>내용</FormLabel>
                <FormControl>
                  <Textarea rows={15} {...field} />
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

export default PostCreate;
