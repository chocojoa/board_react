import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownRight } from "lucide-react";

const PostDetail = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { categoryId, postId } = useParams();
  const [post, setPost] = useState({});
  const [comment, setComment] = useState([]);
  const [showReply, setShowReply] = useState(false);

  const breadCrumbList = [
    { url: `/categories/${categoryId}/posts`, name: "자유게시판" },
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

  const retrieveCommentList = () => {
    api({
      url: `/api/boards/${categoryId}/posts/${postId}/comments`,
      method: "GET",
    }).then((response) => {
      console.log(response.data.data);
      setComment(response.data.data);
    });
  };

  useEffect(() => {
    retrievePost();
    retrieveCommentList();
  }, []);

  return (
    <>
      <PageHeader title="자유게시판" itemList={breadCrumbList} />
      <div>
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
      </div>
      <div className="flex w-full justify-end mt-4">
        <div className="items-end space-x-2">
          <Button onClick={gotoEdit}>수정</Button>
          <Button onClick={gotoList}>목록</Button>
        </div>
      </div>
      <div>
        {comment.map((c) => (
          <Fragment key={c.id}>
            <div className="flex w-full grid grid-cols-12 items-center space-x-2 py-2">
              {c.step > 0 && (
                <div className="text-center">
                  <CornerDownRight />
                </div>
              )}
              <div className="col-span-1 text-center">
                <span>{c.author}</span>
              </div>
              <div className="col-span-9">
                <span>{c.content}</span>
              </div>
              {c.step === 0 && (
                <div className="text-center">
                  <Button onClick={() => setShowReply(!showReply)}>
                    {showReply ? "취소" : "댓글"}
                  </Button>
                </div>
              )}
              <div className="col-span-1">
                <span>{c.createdDate}</span>
              </div>
            </div>
            {showReply && (
              <div className="flex w-full grid grid-cols-12 items-center space-x-2 py-2">
                <div className="col-span-1 text-center">
                  <span>댓글</span>
                </div>
                <div className="col-span-10">
                  <Textarea row="3" />
                </div>
                <div className="col-span-1 text-center">
                  <Button>저장</Button>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div></div>
    </>
  );
};

export default PostDetail;
