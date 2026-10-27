import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from '../auth/dto/create-resume.dto';

@Controller('api')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get('resume')
  async getResume() {
    return this.resumeService.getResume();
  }

  @Get('resume/:id')
  async getResumeById(@Param('id', ParseIntPipe) id: number) {
    return this.resumeService.getResumeById(id);
  }

  @Post('create-resume')
  async createResume(
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
    @Body()
    createResumeDto: CreateResumeDto,
  ) {
    return this.resumeService.createResume(
      Number(req.user.userId),
      createResumeDto,
    );
  }
}
