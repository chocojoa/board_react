import { z } from "zod";

const roleFormSchema = () => {
  return z.object({
    roleName: z
      .string()
      .trim()
      .min(1, { message: "권한이 입력되지 않았습니다." }),
    description: z.string().trim(),
  });
};

export default roleFormSchema;
