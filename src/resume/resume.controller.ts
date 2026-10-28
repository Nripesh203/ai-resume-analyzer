import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UpdateResumeDto } from '../dto/update-resume.dto';

@Controller('api')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(JwtGuard)
  @Get('resume')
  async getResume() {
    return this.resumeService.getResume();
  }

  @UseGuards(JwtGuard)
  @Get('resume/:id')
  async getResumeById(@Param('id', ParseIntPipe) id: number) {
    return this.resumeService.getResumeById(id);
  }

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Put('update-resume/:id')
  async updateResume(
    @Req()
    req: Request & { user: { userId: string | number; username: string } },
    @Param('id', ParseIntPipe) resumeId: number,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.updateResume(
      Number(req.user.userId),
      resumeId,
      updateResumeDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('delete-resume/:id')
  async deleteResume(
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
    @Param('id', ParseIntPipe) resumeId: number,
  ) {
    return this.resumeService.deleteResume(Number(req.user.userId), resumeId);
  }
}
