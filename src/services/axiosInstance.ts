import axios from "axios";
import API_BASE_URL from "../config";
import logger from "../utils/logger";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error("❌ API Error:", error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token expired or unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user_data"); // clear any other session data
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
