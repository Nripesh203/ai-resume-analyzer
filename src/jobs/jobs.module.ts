import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JobController } from './jobs.controller';
import { JobService } from './jobs.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
