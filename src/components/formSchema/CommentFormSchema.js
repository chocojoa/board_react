import { z } from "zod";

const commentFormSchema = () => {
  return z.object({
    content: z
      .string({
        required_error: "댓글을 입력해 주세요"
      })
      .trim()
      .min(1, { message: "댓글이 입력되지 않았습니다." }),
  });
};

export default commentFormSchema;
