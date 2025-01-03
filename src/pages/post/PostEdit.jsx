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

  const formSchema = postFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  /**
   * 게시글 조회
   */
  const retrievePost = () => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}`,
      method: "GET",
    }).then((response) => {
      const post = response.data.data;
      Object.keys(post).map((key) => {
        form.setValue(key, post[key]);
      });
    });
  };

  /**
   * 게시글 저장
   * @param {*} data form data
   */
  const onSubmit = (data) => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}`,
      method: "PUT",
      data: {
        title: data.title,
        content: data.content,
        userId: user.userId,
      },
    })
      .then(() => {
        toast({
          title: "수정되었습니다.",
        });
        gotoDetail(postId);
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
