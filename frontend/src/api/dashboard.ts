import { apiClient } from "./axios";

export interface CampaignStats {
  name: string;
  status: "Active" | "Paused" | "Completed";
  impressions: number;
  clicks: number;
  spend: number;
}

interface DashboardStatsResponse {
  campaigns: CampaignStats[];
}

export const apiGetDashboardStats = async (): Promise<CampaignStats[]> => {
  const response = await apiClient.get<
    DashboardStatsResponse,
    DashboardStatsResponse
  >("/dashboard/stats");
  return response.campaigns;
};
