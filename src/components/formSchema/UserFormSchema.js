import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
);

const userFormSchema = () => {
  return z
    .object({
      userName: z
        .string({
          required_error: "이름을 입력해 주세요"
        })
        .trim()
        .min(1, { message: "이름이 입력되지 않았습니다." }),
      email: z
        .string({
          required_error: "이메일 주소를 입력해 주세요"
        })
        .trim()
        .min(1, { message: "이메일 주소가 입력되지 않았습니다." })
        .email({ message: "이메일 형식에 맞지 않습니다." }),
      password: z
        .string({
          required_error: "비밀번호를 입력해 주세요"
        })
        .trim()
        .min(8, { message: "비밀번호는 8자 이상입니다." })
        .max(15, { message: "비밀번호는 15자 이하입니다." })
        .regex(passwordRegex, { message: "비밀번호 형식에 맞지 않습니다." }),
      verifyPassword: z
        .string({
          required_error: "비밀번호를 입력해 주세요"
        })
        .trim()
        .min(8, { message: "비밀번호는 8자 이상입니다." })
        .max(15, { message: "비밀번호는 15자 이하입니다." })
        .regex(passwordRegex, { message: "비밀번호 형식에 맞지 않습니다." }),
    })
    .refine((data) => data.password === data.verifyPassword, {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["verifyPassword"],
    });
};

export default userFormSchema;
