import store from "@/store";
import authSlice from "@/store/authSlice";
import axios from "axios";

const useAxios = () => {
  const token = store.getState().auth.token;

  const instance = axios.create({
    timeout: 1000,
  });

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

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const errorCode = error.response.data.errorCode;
      const status = error.response.status;
      if (status === 401) {
        if (errorCode === "EXPIRED_TOKEN") {
          await axios({
            method: "POST",
            url: "/api/auth/reissue",
            data: {
              refreshToken: token.refreshToken,
            },
          })
            .then((response) => {
              store.dispatch(authSlice.actions.signIn(response.data));
              error.config.headers = {
                Authorization: `Bearer ${response.data.token.accessToken}`,
              };
              // 재요청
              return axios.request(error.config);
            })
            .then(() => {
              window.location.reload();
            })
            .catch((error) => {
              const reissueErrorCode = error.response.data.errorCode;
              if (reissueErrorCode === "EXPIRED_TOKEN") {
                localStorage.clear();
                alert("토큰이 만료되어 로그아웃 되었습니다.");
              } else {
                alert("error");
              }
            });
        } else {
          alert(error);
        }
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    }
  );
  return instance;
};

export default useAxios;
