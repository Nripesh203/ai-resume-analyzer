import { Module } from '@nestjs/common';
import { ExtractionService } from './extraction.service';
import { ResumeModule } from './resume.module';

@Module({
  imports: [ResumeModule],
  controllers: [],
  providers: [ExtractionService],
})
export class ExtractionModule {}
