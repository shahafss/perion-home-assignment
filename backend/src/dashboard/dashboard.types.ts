export type CampaignStatus = 'Active' | 'Paused' | 'Completed';

export interface CampaignStats {
  name: string;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
  spend: number;
}
