import store from "@/store";
import authSlice from "@/store/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

const useAxios = () => {
  const token = store.getState().auth.token;
  const navigate = useNavigate();
  const { toast } = useToast();

  const instance = axios.create({
    timeout: 5000,
  });

  let isRefreshing = false;
  let refreshSubscribers = [];

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      const { data } = await axios.post("/api/auth/reissue", {
        refreshToken: token.refreshToken,
      });
      store.dispatch(authSlice.actions.signIn(data.data));
      return data.data.token.accessToken;
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "사용시간이 만료되어 로그아웃 되었습니다.",
      });
      store.dispatch(authSlice.actions.signOut());
      navigate("/");
      return null;
    }
  };

  // 대기 중인 요청 처리 함수
  const onTokenRefreshed = (accessToken) => {
    refreshSubscribers.forEach((callback) => callback(accessToken));
    refreshSubscribers = [];
  };

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      if (token?.accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token.accessToken}`,
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 인증 에러(401) 및 토큰 만료 처리
      if (
        error.response?.status === 401 &&
        error.response?.data?.errorCode === "JWT_TOKEN_IS_EXPIRED" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // 중복 처리 방지

        if (!isRefreshing) {
          isRefreshing = true;

          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            onTokenRefreshed(newAccessToken);
            isRefreshing = false;
            return axios({
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
          }

          isRefreshing = false;
          return Promise.reject(error);
        }

        // 리프레시 중인 경우 대기
        return new Promise((resolve) => {
          refreshSubscribers.push((accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axios(originalRequest));
          });
        });
      }

      // 기타 에러 처리
      toast({
        variant: "destructive",
        title: "요청 실패",
        description:
          error.response?.data?.message || "알 수 없는 오류가 발생했습니다.",
      });

      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
