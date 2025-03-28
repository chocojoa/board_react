import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

import CommentList from "./CommentList";
import CommentCreate from "./CommentCreate";
import { toast } from "sonner";

const PostDetail = () => {
  const pageTitle = "자유게시판";
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const api = useAxios();
  const location = useLocation();
  const { categoryId, postId } = useParams();

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);

  const retrievePost = async () => {
    try {
      const { data } = await api({
        url: `/api/boards/${categoryId}/posts/${postId}?userId=${user.userId}`,
        method: "GET",
      });
      setPost(data.data);
    } catch (error) {
      toast.error("게시글 조회 중 오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const retrieveCommentList = async () => {
    try {
      const { data } = await api({
        url: `/api/boards/${categoryId}/posts/${postId}/comments`,
        method: "GET",
      });
      setComments(data.data);
    } catch (error) {
      toast.error("댓글 조회 중 오류가 발생했습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const handleEdit = () =>
    navigate(`/boards/${categoryId}/posts/${postId}/edit`);
  const handleList = () =>
    navigate(`/boards/${categoryId}/posts`, { state: location.state });

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([retrievePost(), retrieveCommentList()]);
    };
    fetchData();
  }, []);

  return (
    <div className="my-4">
      <PageHeader title={pageTitle} />
      <div>
        <div className="flex justify-between mx-1 pt-4 pb-2">
          <div>
            <span className="font-semibold">{post.title}</span>
          </div>
          <div className="space-x-2 text-sm">
            <span>등록일: {post.createdDate}</span>
            <span>작성자: {post.author}</span>
            <span>조회수: {post.viewCount}</span>
          </div>
        </div>
        <div className="w-full border rounded-sm px-2 py-2">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
      <div className="flex w-full justify-end mt-4">
        <div className="items-end space-x-2">
          <Button type="button" onClick={handleEdit}>
            수정
          </Button>
          <Button type="button" variant="outline" onClick={handleList}>
            목록
          </Button>
        </div>
      </div>
      <div>
        <CommentCreate
          categoryId={categoryId}
          postId={postId}
          retrieveCommentList={retrieveCommentList}
        />
      </div>
      <div>
        <CommentList
          comments={comments}
          categoryId={categoryId}
          postId={postId}
          retrieveCommentList={retrieveCommentList}
        />
      </div>
    </div>
  );
};

export default PostDetail;
