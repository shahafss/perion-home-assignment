import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { UserModule } from './users/user.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, DashboardModule],
  controllers: [HealthController]
})
export class AppModule {}
