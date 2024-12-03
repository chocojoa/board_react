import { createSlice } from "@reduxjs/toolkit";

const initialMenuState = {
  menuList: [],
};

const menuSlice = createSlice({
  name: "userMenu",
  initialState: initialMenuState,
  reducers: {
    setUserMenu(state, action) {
      state.menuList = action.payload;
    },
  },
});

export default menuSlice;
