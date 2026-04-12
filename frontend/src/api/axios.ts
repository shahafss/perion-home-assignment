import axios, { AxiosResponse } from "axios";
import { useAuth } from "../composables/useAuth";

interface ApiEnvelope<T> {
  success: boolean;
  timestamp: string;
  path: string;
  data: T;
}

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const unwrapResponse = <T>(response: AxiosResponse<ApiEnvelope<T>>): T =>
  response.data.data;

apiClient.interceptors.response.use(
  unwrapResponse as unknown as (
    value: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>,
  (error) => {
    if (error?.response?.status === 401) {
      const { logout } = useAuth();
      logout();
    }
    return Promise.reject(error);
  },
);
