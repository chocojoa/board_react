import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import useAxios from "@/hooks/useAxios";

const CommentCreate = ({
  categoryId,
  postId,
  parentCommentId = 0,
  retrieveCommentList,
  handleCommentClose,
}) => {
  const api = useAxios();
  const user = useSelector((state) => state.auth.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
      reset();
      retrieveCommentList();
      if (typeof handleCommentClose === "function") {
        handleCommentClose();
      }
    });
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center space-x-2 pt-4 pb-2">
          <div className="w-11/12">
            <Textarea
              row="3"
              placeholder="댓글을 입력해 주세요"
              {...register("content", {
                required: "댓글이 입력되지 않았습니다.",
              })}
            />
            {errors.content && (
              <span className="text-sm font-medium text-red-500">
                {errors.content.message}
              </span>
            )}
          </div>
          <div className="w-1/12 text-center">
            <Button type="submit" size="sm">
              저장
            </Button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default CommentCreate;
