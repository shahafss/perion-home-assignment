import { Injectable } from '@nestjs/common';
import { CampaignStats } from './dashboard.types';

const MOCK_CAMPAIGNS: CampaignStats[] = [
  {
    name: 'Spring Launch - US Mobile',
    status: 'Active',
    impressions: 1285400,
    clicks: 42190,
    spend: 12435.52
  },
  {
    name: 'Retargeting - Lifestyle Segment',
    status: 'Paused',
    impressions: 742300,
    clicks: 17342,
    spend: 6880.1
  },
  {
    name: 'Brand Awareness - EMEA',
    status: 'Completed',
    impressions: 2153200,
    clicks: 50991,
    spend: 18349.77
  }
];

@Injectable()
export class DashboardService {
  getCampaignStats(): CampaignStats[] {
    return MOCK_CAMPAIGNS;
  }
}
