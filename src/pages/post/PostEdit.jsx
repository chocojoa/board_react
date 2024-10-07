import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PostEdit = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { categoryId, postId } = useParams();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const retrievePost = () => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}`,
      method: "GET",
    }).then((response) => {
      const post = response.data.data;
      Object.keys(post).map((key) => {
        setValue(key, post[key]);
      });
    });
  };

  const onSubmit = (data) => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}`,
      method: "PUT",
      data: {
        title: data.title,
        content: data.content,
        userId: user.userId,
      },
    }).then(() => {
      Swal.fire({
        icon: "success",
        title: "수정되었습니다.",
        timer: 2000,
      }).then(() => {
        gotoDetail(postId);
      });
    });
  };

  useEffect(() => {
    retrievePost();
  }, []);

  return (
    <>
      <PageHeader title="자유게시판" itemList={breadCrumbList} />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="py-4">
          <div>
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
        </div>
        <div className="flex w-full justify-end mt-4">
          <div className="items-end space-x-2">
            <Button type="submit">저장</Button>
            <Button onClick={gotoList}>목록</Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PostEdit;
