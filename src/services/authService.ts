import axios from "./axiosInstance";

export const login = async (email: string, password: string) => {
  const response = await axios.post("/Auth/login", { email, password });
  return response.data;
};
