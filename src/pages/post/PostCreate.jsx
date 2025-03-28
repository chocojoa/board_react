import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { toast } from "sonner";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PostForm from "@/components/form/PostForm";
import postFormSchema from "@/components/formSchema/PostFormSchema";

const PostCreate = () => {
  const pageTitle = "자유게시판";
  const navigate = useNavigate();
  const api = useAxios();
  const { categoryId } = useParams();
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

  const onSubmit = async (formData) => {
    try {
      const { data } = await api({
        url: `/api/boards/${categoryId}/posts`,
        method: "POST",
        data: {
          title: formData.title,
          content: formData.content,
          userId: user.userId,
        },
      });

      toast.success("저장되었습니다.");
      gotoDetail(data.data.postId);
    } catch (error) {
      toast.error("저장 도중 문제가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

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
                취소
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostCreate;
