import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import commentFormSchema from "@/components/formSchema/CommentFormSchema";
import CommentForm from "@/components/form/CommentForm";

const CommentCreate = ({
  categoryId,
  postId,
  parentCommentId = 0,
  retrieveCommentList,
  handleCommentClose,
}) => {
  const api = useAxios();
  const user = useSelector((state) => state.auth.user);

  const form = useForm({
    resolver: zodResolver(commentFormSchema()),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await api({
        url: `/api/boards/${categoryId}/posts/${postId}/comments`,
        method: "POST",
        data: {
          categoryId,
          postId,
          parentCommentId,
          content: formData.content,
          userId: user.userId,
        },
      });

      form.reset();
      retrieveCommentList();

      if (typeof handleCommentClose === "function") {
        handleCommentClose();
      }

      toast.success("댓글이 등록되었습니다.");
    } catch (error) {
      toast.error("댓글 등록 중 오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center space-x-2 pt-4 pb-2">
          <div className="w-11/12">
            <CommentForm form={form} />
          </div>
          <div className="w-1/12 text-center">
            <Button type="submit" size="sm">
              저장
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentCreate;
