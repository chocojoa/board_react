import { z } from "zod";

const menuFormSchema = () => {
  return z.object({
    menuId: z.number(),
    parentMenuId: z.number(),
    menuName: z
      .string({
        required_error: "메뉴명을 입력해 주세요",
      })
      .trim()
      .min(1, { message: "메뉴명이 입력되지 않았습니다." }),
    menuUrl: z.string().trim(),
    sortOrder: z.number({
      required_error: "정렬순서가 입력되지 않았습니다.",
      invalid_type_error: "숫자 형식이 아닙니다.",
    }),
    icon: z.string(),
    usageStatus: z.boolean(),
    isDisplayed: z.boolean(),
  });
};

export default menuFormSchema;
