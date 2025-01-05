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
import PostForm from "@/components/form/PostForm";
import postFormSchema from "@/components/formSchema/PostFormSchema";

const PostEdit = () => {
  const pageTitle = "자유게시판";
  const navigate = useNavigate();
  const api = useAxios();
  const { toast } = useToast();
  const { categoryId, postId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const form = useForm({
    resolver: zodResolver(postFormSchema()),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const gotoDetail = (postId) =>
    navigate(`/boards/${categoryId}/posts/${postId}`);
  const gotoList = () => navigate(`/boards/${categoryId}/posts`);

  const retrievePost = async () => {
    try {
      const { data } = await api({
        url: `/api/boards/${categoryId}/posts/${postId}`,
        method: "GET",
      });

      Object.keys(data.data).forEach((key) => {
        form.setValue(key, data.data[key]);
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "게시글 조회 중 오류가 발생했습니다.",
        description: error.response?.data?.message,
      });
    }
  };

  const onSubmit = async (formData) => {
    try {
      await api({
        url: `/api/boards/${categoryId}/posts/${postId}`,
        method: "PUT",
        data: {
          title: formData.title,
          content: formData.content,
          userId: user.userId,
        },
      });

      toast({ title: "수정되었습니다." });
      gotoDetail(postId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    retrievePost();
  }, []);

  return (
    <div className="my-4">
      <PageHeader title={pageTitle} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PostForm form={form} />
          <div className="flex w-full justify-end mt-4">
            <div className="items-end space-x-2">
              <Button type="submit">저장</Button>
              <Button type="button" variant="outline" onClick={gotoList}>
                목록
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostEdit;
