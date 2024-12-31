import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PostForm from "@/components/form/PostForm";
import postFormSchema from "@/components/formSchema/PostFormSchema";

const PostCreate = () => {
  const pageTitle = "자유게시판";

  const navigate = useNavigate();
  const api = useAxios();
  const { toast } = useToast();

  const { categoryId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const formSchema = postFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  /**
   * 게시글 저장
   * @param {*} data form dataf
   */
  const onSubmit = (data) => {
    api({
      url: `/api/boards/${categoryId}/posts`,
      method: "POST",
      data: {
        title: data.title,
        content: data.content,
        userId: user.userId,
      },
    })
      .then((response) => {
        toast({
          title: "저장되었습니다.",
        });
        gotoDetail(response.data.data.postId);
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
   * @param {*} postId 게시글 아이디
   */
  const gotoDetail = (postId) => {
    navigate(`/boards/${categoryId}/posts/${postId}`);
  };

  /**
   * 목록화면으로 이동
   */
  const gotoList = () => {
    navigate(`/boards/${categoryId}/posts`);
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
                목록
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostCreate;
