import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

const UNAUTHORIZED = 401;
const ACCESSDENIED = 403;

axiosInstance.interceptors.request.use(
  (config: any) => {
    // Clone the request configuration to avoid modifying the original
    const authorizationConfig = { ...config };
    const token = getCookie("authKey");
    // Set the Authorization header in the request configuration
    if (token && authorizationConfig && authorizationConfig.headers) {
      // Retrieve the authentication token from your storage (getItem function)
      authorizationConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Return the modified configuration
    return authorizationConfig;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (config) => config,
  (error) => {
    const { status, data, request } = error?.response;
    if (status === UNAUTHORIZED) {
      deleteCookie("authKey");
      localStorage.clear();
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }
    // else if (status === ACCESSDENIED) {
    //   window.location.href = "/dashboard";
    // }
    return Promise.reject(error);
  }
);
