import { z } from "zod";

const roleFormSchema = () => {
  return z.object({
    roleName: z
      .string({
        required_error: "권한을 입력해 주세요"
      })
      .trim()
      .min(1, { message: "권한이 입력되지 않았습니다." }),
    description: z.string().trim(),
  });
};

export default roleFormSchema;
