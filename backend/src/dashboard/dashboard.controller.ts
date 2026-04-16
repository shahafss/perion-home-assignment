import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { DashboardService } from './dashboard.service';
import { CampaignStats } from './dashboard.types';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getProfile(@Req() request: AuthenticatedRequest): {
    user: { id: string; email: string };
  } {
    return {
      user: {
        id: request.user.id,
        email: request.user.email
      }
    };
  }

  @Get('stats')
  getStats(): { campaigns: CampaignStats[] } {
    return {
      campaigns: this.dashboardService.getCampaignStats()
    };
  }
}
