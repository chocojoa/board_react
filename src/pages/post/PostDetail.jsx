import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

import CommentList from "./CommentList";
import CommentCreate from "./CommentCreate";

const PostDetail = () => {
  const pageTitle = "자유게시판";

  const navigate = useNavigate();
  const api = useAxios();

  const { categoryId, postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const location = useLocation();

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  /**
   * 네비게이션 조회
   */
  const retrieveBreadcrumbs = () => {
    const url = `/api/admin/menus/breadcrumbs?menuName=${pageTitle}`;
    api({
      url: encodeURI(url),
      method: "GET",
    }).then((response) => {
      setBreadcrumbs(response.data.data);
    });
  };

  /**
   * 게시글 조회
   */
  const retrievePost = () => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}`,
      method: "GET",
    }).then((response) => {
      setPost(response.data.data);
    });
  };

  /**
   * 코멘트 조회
   */
  const retrieveCommentList = () => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}/comments`,
      method: "GET",
    }).then((response) => {
      setComments(response.data.data);
    });
  };

  /**
   * 수정화면으로 이동
   */
  const gotoEdit = () => {
    navigate(`/boards/${categoryId}/posts/${postId}/edit`);
  };

  /**
   * 목록화면으로 이동
   */
  const gotoList = () => {
    navigate(`/boards/${categoryId}/posts`, { state: location.state });
  };

  useEffect(() => {
    retrievePost();
    retrieveCommentList();
    retrieveBreadcrumbs();
  }, []);

  return (
    <div className="my-4">
      {breadcrumbs.length > 0 && (
        <PageHeader title={pageTitle} itemList={breadcrumbs} />
      )}
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
          <Button type="button" onClick={gotoEdit}>
            수정
          </Button>
          <Button type="button" onClick={gotoList}>
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
