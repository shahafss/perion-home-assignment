import axios from "axios";
export const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
});
const unwrapResponse = (response) => response.data.data;
apiClient.interceptors.response.use(unwrapResponse, (error) => Promise.reject(error));
