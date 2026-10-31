import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AiMatchingController } from './ai-matching.controller';
import { AiMatchingService } from './ai-matching.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AiMatchingController],
  providers: [AiMatchingService],
})
export class AiMatchingModule {}
