import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useAxios = () => {
  const navigate = useNavigate();

  const instance = axios.create({
    timeout: 5000,
    withCredentials: true,
  });

  let isRefreshing = false;
  let refreshSubscribers = [];

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/reissue",
        {},
        { withCredentials: true }
      );
      useAuthStore.getState().signIn(data.data);
      return true;
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "사용시간이 만료되어 로그아웃 되었습니다.",
      });
      useAuthStore.getState().signOut();
      navigate("/");
      return false;
    }
  };

  // 대기 중인 요청 처리 함수
  const onTokenRefreshed = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
  };

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => config,
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

          const refreshed = await refreshToken();
          if (refreshed) {
            onTokenRefreshed();
            isRefreshing = false;
            return instance(originalRequest);
          }

          isRefreshing = false;
          return Promise.reject(error);
        }

        // 리프레시 중인 경우 대기
        return new Promise((resolve) => {
          refreshSubscribers.push(() => {
            resolve(instance(originalRequest));
          });
        });
      }

      // 기타 에러 처리
      toast.error("요청 실패", {
        description: error.response?.data?.message,
      });

      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
