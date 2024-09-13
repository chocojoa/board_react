import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PostCreate = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { categoryId } = useParams();
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const breadCrumbList = [
    { url: `/categories/${categoryId}/posts`, name: `자유게시판` },
  ];

  const gotoDetail = (postId) => {
    navigate(`/boards/${categoryId}/posts/${postId}`);
  };

  const gotoList = () => {
    navigate(`/boards/${categoryId}/posts`);
  };

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <PageHeader title="자유게시판" itemList={breadCrumbList} />
      <div className="py-4">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex items-center justify-between">
              <div className="font-semibold">게시글 등록</div>
              <div className="flex space-x-2">
                <Button type="submit">저장</Button>
              </div>
            </div>
            <div>
              <div className="w-full items-center my-2 space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  type="text"
                  {...register("title", {
                    required: "제목이 입력되지 않았습니다.",
                  })}
                />
                {errors.title && (
                  <span className="text-sm font-medium text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className="w-full items-center my-2 space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  {...register("content", {
                    required: "내용이 입력되지 않았습니다.",
                  })}
                  rows={15}
                />
                {errors.content && (
                  <span className="text-sm font-medium text-red-500">
                    {errors.content.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="flex w-full justify-end mt-4">
        <div className="items-end">
          <Button onClick={gotoList}>목록</Button>
        </div>
      </div>
    </>
  );
};

export default PostCreate;