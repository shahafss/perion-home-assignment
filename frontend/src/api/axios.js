import axios from "axios";
import { useAuth } from "../composables/useAuth";
export const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
});
const unwrapResponse = (response) => response.data.data;
apiClient.interceptors.response.use(unwrapResponse, (error) => {
    if (error?.response?.status === 401) {
        const { logout } = useAuth();
        logout();
    }
    return Promise.reject(error);
});
