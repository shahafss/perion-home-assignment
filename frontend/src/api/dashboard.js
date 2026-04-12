import { apiClient } from "./axios";
export const apiGetDashboardStats = async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.campaigns;
};
