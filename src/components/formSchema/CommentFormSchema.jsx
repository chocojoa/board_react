import { z } from "zod";

const commentFormSchema = () => {
  return z.object({
    content: z
      .string()
      .trim()
      .min(1, { message: "댓글이 입력되지 않았습니다." }),
  });
};

export default commentFormSchema;
