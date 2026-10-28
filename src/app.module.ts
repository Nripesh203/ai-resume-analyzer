import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resume/resume.module';
import { JobModule } from './jobs/jobs.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ResumeModule,
    JobModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
