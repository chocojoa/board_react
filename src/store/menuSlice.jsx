import { createSlice } from "@reduxjs/toolkit";

// 초기 메뉴 상태 정의
const initialState = {
  menuList: [],
};

// 메뉴 관련 슬라이스 생성
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // 메뉴 설정 액션
    setMenuList: (state, { payload }) => {
      state.menuList = payload;
    },
  },
});

// 액션 생성자 내보내기
export const { setMenuList } = menuSlice.actions;

export default menuSlice.reducer;
