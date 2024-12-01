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

  //요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //응답 인터셉터
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      console.log(error);
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.errorCode === "JWT_TOKEN_IS_EXPIRED"
      ) {
        // 토큰 갱신 중인지 확인
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { data } = await axios.post("/api/auth/reissue", {
              refreshToken: token.refreshToken,
            });
            // 새로운 토큰을 상태에 저장
            store.dispatch(authSlice.actions.signIn(data.data));

            // 대기 중인 요청들에게 갱신된 토큰을 제공
            refreshSubscribers.forEach((callback) =>
              callback(data.data.token.accessToken)
            );

            refreshSubscribers = [];

            // 갱신된 토큰을 원래 요청에 설정
            originalRequest.headers["Authorization"] =
              `Bearer ${data.data.token.accessToken}`;

            isRefreshing = false;

            return axios(originalRequest);
          } catch (err) {
            toast({
              variant: "destructive",
              title: "사용시간이 만료되어 로그아웃 되었습니다.",
            });
            isRefreshing = false;
            store.dispatch(authSlice.actions.signOut());
            navigate("/");
            return Promise.reject(err);
          }
        }

        // 다른 요청들이 리프레시 중일 때는 해당 Promise가 끝날 때까지 대기
        return new Promise((resolve) => {
          refreshSubscribers.push((accessToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            resolve(axios(originalRequest));
          });
        });
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export default useAxios;
