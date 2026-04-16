import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [SeederService]
})
export class SeederModule {}
