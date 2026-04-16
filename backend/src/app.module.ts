import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { SeederModule } from './database/seeder.module';
import { HealthController } from './health.controller';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    DatabaseModule,
    SeederModule,
    UserModule,
    AuthModule,
    DashboardModule,
    RolesModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
