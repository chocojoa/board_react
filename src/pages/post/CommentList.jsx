import { Fragment, useState } from "react";
import CommentItem from "./CommentItem";

const CommentList = ({ comments, categoryId, postId, retrieveCommentList }) => {
  const [replyCommentId, setReplyCommentId] = useState(null);

  const handleReplyClick = (commentId) => {
    setReplyCommentId(replyCommentId === commentId ? null : commentId);
  };

  const handleCommentClose = () => {
    setReplyCommentId(null);
  };

  return (
    <Fragment>
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          onReplyClick={handleReplyClick}
          isReplyOpen={replyCommentId === comment.commentId}
          categoryId={categoryId}
          postId={postId}
          retrieveCommentList={retrieveCommentList}
          handleCommentClose={handleCommentClose}
        />
      ))}
    </Fragment>
  );
};

export default CommentList;
