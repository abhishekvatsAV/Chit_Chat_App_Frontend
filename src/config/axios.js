import axios from "axios";
import { endpoint } from "../helper";

const instance = axios.create({ baseURL: endpoint });

instance.interceptors.request.use((config) => {
  const rawUser = localStorage.getItem("userInfo");
  const userInfo = rawUser ? JSON.parse(rawUser) : null;
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
