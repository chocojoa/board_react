import { createSlice } from "@reduxjs/toolkit";

// 초기 인증 상태 정의
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// 인증 관련 슬라이스 생성
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인 액션
    signIn: (state, { payload }) => {
      const { user, token } = payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
    },

    // 로그아웃 액션
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

// 액션 생성자 내보내기
export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
