import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authSlice from "./authSlice";
import menuSlice from "./menuSlice";

// Redux Persist 설정
const persistConfig = {
  key: "root", // 저장소 키
  version: 1,
  storage, // 로컬 스토리지 사용
  whitelist: ["auth", "menu"], // 유지할 리듀서 목록
};

// 루트 리듀서 설정
const rootReducer = combineReducers({
  auth: authSlice,
  menu: menuSlice,
});

// 영속성이 적용된 리듀서 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux 스토어 설정
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist 액션 무시
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Redux Persist 스토어 생성
export const persistor = persistStore(store);
export default store;
