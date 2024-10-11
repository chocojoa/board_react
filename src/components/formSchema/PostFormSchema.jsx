import { z } from "zod";

const postFormSchema = () => {
  return z.object({
    title: z.string().trim().min(1, { message: "제목이 입력되지 않았습니다." }),
    content: z
      .string()
      .trim()
      .min(1, { message: "내용이 입력되지 않았습니다." }),
  });
};

export default postFormSchema;
