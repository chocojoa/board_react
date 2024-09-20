import { Button } from "@/components/ui/button";
import { CornerDownRight } from "lucide-react";
import { Fragment, useState } from "react";
import CommentCreate from "./CommentCreate";

const CommentList = ({ comments, categoryId, postId, retrieveCommentList }) => {
  const [replyCommentId, setReplyCommentId] = useState(null);

  const handleReplyClick = (commentId) => {
    if (replyCommentId === commentId) {
      setReplyCommentId(null);
    } else {
      setReplyCommentId(commentId);
    }
  };

  return (
    <Fragment>
      {comments.map((comment) => (
        <div key={comment.commentId}>
          <div className="flex w-full grid grid-cols-12 items-center space-x-2 py-2 border-b">
            <div className="col-span-1">
              <div className="flex w-full space-x-2">
                {comment.step > 0 && (
                  <div>
                    <CornerDownRight />
                  </div>
                )}
                <div>{comment.author}</div>
              </div>
            </div>
            <div className="col-span-10">
              <div className="flex w-full items-center justify-between">
                <div>
                  <span className="whitespace-pre-wrap">{comment.content}</span>
                </div>
                {comment.step === 0 && (
                  <div className="items-end">
                    <Button
                      size="sm"
                      onClick={() => handleReplyClick(comment.commentId)}
                    >
                      {replyCommentId === comment.commentId ? "취소" : "댓글"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-1 text-sm">
              <span>{comment.createdDate}</span>
            </div>
          </div>
          {replyCommentId === comment.commentId && (
            <CommentCreate
              categoryId={categoryId}
              postId={postId}
              parentCommentId={comment.commentId}
              retrieveCommentList={retrieveCommentList}
            />
          )}
        </div>
      ))}
    </Fragment>
  );
};

export default CommentList;
