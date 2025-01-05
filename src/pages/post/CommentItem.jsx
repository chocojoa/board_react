import { Button } from "@/components/ui/button";
import { CornerDownRight } from "lucide-react";
import CommentCreate from "./CommentCreate";

const CommentItem = ({
  comment,
  onReplyClick,
  isReplyOpen,
  categoryId,
  postId,
  retrieveCommentList,
  handleCommentClose,
}) => {
  const marginLeft = comment.step > 0 ? `${comment.step * 2}em` : "";

  return (
    <div>
      <div style={{ marginLeft }}>
        <div>
          <div className="flex items-center justify-between border-b py-1">
            <div className="flex items-center space-x-2">
              {comment.step > 0 && <CornerDownRight />}
              <span>{comment.author}</span>
              <div>
                <span className="whitespace-pre-wrap">{comment.content}</span>
              </div>
            </div>
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplyClick(comment.commentId)}
              >
                {isReplyOpen ? "취소" : "댓글"}
              </Button>
              <span className="text-sm">{comment.createdDate}</span>
            </div>
          </div>
        </div>
      </div>
      {isReplyOpen && (
        <CommentCreate
          categoryId={categoryId}
          postId={postId}
          parentCommentId={comment.commentId}
          retrieveCommentList={retrieveCommentList}
          handleCommentClose={handleCommentClose}
        />
      )}
    </div>
  );
};

export default CommentItem;
