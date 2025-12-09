import axios from "axios";
import { endpoint } from "../helper";

const instance = axios.create({
  baseURL: endpoint,
});

instance.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo && userInfo.token) {
      // console.log("Attaching token:", userInfo.token);
      config.headers.Authorization = `Bearer ${userInfo.token}`;
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
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized - Logging out");
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
