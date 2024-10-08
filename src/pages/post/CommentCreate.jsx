import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const CommentCreate = ({
  categoryId,
  postId,
  parentCommentId = 0,
  retrieveCommentList,
  handleCommentClose,
}) => {
  const api = useAxios();
  const user = useSelector((state) => state.auth.user);

  const formSchema = z.object({
    content: z
      .string()
      .trim()
      .min(1, { message: "댓글이 입력되지 않았습니다." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data) => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}/comments`,
      method: "POST",
      data: {
        categoryId: categoryId,
        postId: postId,
        parentCommentId: parentCommentId,
        content: data.content,
        userId: user.userId,
      },
    }).then(() => {
      form.reset();
      retrieveCommentList();
      if (typeof handleCommentClose === "function") {
        handleCommentClose();
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center space-x-2 pt-4 pb-2">
            <div className="w-11/12">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        row="3"
                        placeholder="댓글을 입력해 주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="w-1/12 text-center">
              <Button type="submit" size="sm">
                저장
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CommentCreate;
