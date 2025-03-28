import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
);

const userFormSchema = () => {
  return z
    .object({
      userName: z
        .string({
          required_error: "이름을 입력해 주세요",
        })
        .trim()
        .min(1, { message: "이름이 입력되지 않았습니다." }),
      email: z
        .string({
          required_error: "이메일 주소를 입력해 주세요",
        })
        .trim()
        .min(1, { message: "이메일 주소가 입력되지 않았습니다." })
        .email({ message: "이메일 형식에 맞지 않습니다." }),
      isPasswordChange: z.boolean(),
      password: z.string().optional(),
      verifyPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      //비밀번호 변경이 체크된 경우
      if (data.isPasswordChange) {
        if (
          !data.password ||
          data.password.length < 8 ||
          data.password.length > 15
        ) {
          ctx.addIssue({
            path: ["password"],
            message: "비밀번호는 8자 이상 15자 이하로 입력해 주세요.",
          });
        }
        if (!passwordRegex.test(data.password)) {
          ctx.addIssue({
            path: ["password"],
            message:
              "비밀번호는 영문, 숫자, 특수문자를 포함하여 입력해 주세요.",
          });
        }
        if (
          !data.verifyPassword ||
          data.verifyPassword.length < 8 ||
          data.verifyPassword.length > 15
        ) {
          ctx.addIssue({
            path: ["verifyPassword"],
            message: "비밀번호 확인은 8자 이상 15자 이하로 입력해 주세요.",
          });
        }
        if (!passwordRegex.test(data.verifyPassword)) {
          ctx.addIssue({
            path: ["verifyPassword"],
            message:
              "비밀번호 확인은 영문, 숫자, 특수문자를 포함하여 입력해 주세요.",
          });
        }
        if (
          data.password &&
          data.verifyPassword &&
          data.password !== data.verifyPassword
        ) {
          ctx.addIssue({
            path: ["verifyPassword"],
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
      }
    });
};

export default userFormSchema;
