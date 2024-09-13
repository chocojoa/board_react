import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const PostDetail = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { categoryId, postId } = useParams();
  const [post, setPost] = useState({});

  const breadCrumbList = [
    { url: `/categories/${categoryId}/posts`, name: `자유게시판` },
  ];

  const gotoEdit = () => {
    navigate(`/boards/${categoryId}/posts/${postId}/edit`);
  };

  const gotoList = () => {
    navigate(`/boards/${categoryId}/posts`);
  };

  const retrievePost = () => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}`,
      method: "GET",
    }).then((response) => {
      setPost(response.data.data);
    });
  };

  useEffect(() => {
    retrievePost();
  }, []);

  return (
    <>
      <PageHeader title="자유게시판" itemList={breadCrumbList} />
      <div className="py-4">
        <div>
          <div className="flex items-center justify-between">
            <div className="font-semibold">게시글 조회</div>
            <div className="flex space-x-2">
              <Button type="button" onClick={gotoEdit}>
                수정
              </Button>
            </div>
          </div>
          <div>
            <div className="px-2 py-2 my-2 border-b">
              <span className="font-semibold">{post.title}</span>
            </div>
            <div className="px-2 py-2 my-2 border-b text-sm">
              <div className="w-full pb-2">
                <span>작성자: {post.author}</span>
              </div>
              <div className="w-full pb-2">
                <span>작성일: {post.createdDate}</span>
              </div>
              <div className="w-full pb-2">
                <span>조회수: {post.viewCount}</span>
              </div>
            </div>
            <div className="w-full px-2 py-2 border-b">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end mt-4">
        <div className="items-end">
          <Button onClick={gotoList}>목록</Button>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
