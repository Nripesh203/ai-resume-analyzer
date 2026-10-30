import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JobController } from './jobs.controller';
import { JobService } from './jobs.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [JobController],
  providers: [JobService, RolesGuard],
})
export class JobModule {}
