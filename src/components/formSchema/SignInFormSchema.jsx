import { z } from "zod";

const signInFormSchema = () => {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: "이메일이 입력되지 않았습니다." })
      .email({ message: "이메일 형식에 맞지 않습니다." }),
    password: z
      .string()
      .trim()
      .min(1, { message: "비밀번호가 입력되지 않았습니다." }),
  });
};

export default signInFormSchema;
