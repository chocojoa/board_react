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

  const handleCommentClose = () => {
    setReplyCommentId(null);
  };

  return (
    <Fragment>
      {comments.map((comment) => (
        <div key={comment.commentId}>
          <div
            style={{
              marginLeft: comment.step > 0 ? comment.step * 2 + "em" : "",
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b py-1">
                <div className="flex items-center space-x-2">
                  {comment.step > 0 && <CornerDownRight />}
                  <span>{comment.author}</span>
                  <div>
                    <span className="whitespace-pre-wrap">
                      {comment.content}
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReplyClick(comment.commentId)}
                  >
                    {replyCommentId === comment.commentId ? "취소" : "댓글"}
                  </Button>
                  <span className="text-sm">{comment.createdDate}</span>
                </div>
              </div>
            </div>
          </div>
          {replyCommentId === comment.commentId && (
            <CommentCreate
              categoryId={categoryId}
              postId={postId}
              parentCommentId={comment.commentId}
              retrieveCommentList={retrieveCommentList}
              handleCommentClose={handleCommentClose}
            />
          )}
        </div>
      ))}
    </Fragment>
  );
};

export default CommentList;
