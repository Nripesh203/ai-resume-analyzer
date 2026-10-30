import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ResumeController],
  providers: [ResumeService, CloudinaryService],
})
export class ResumeModule {}
