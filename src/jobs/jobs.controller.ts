import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UpdateJobDto } from '../dto/update-job.dto';
import { PatchJobDto } from '../dto/Patch-Job.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('api')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtGuard)
  @Get('jobs')
  async getJobs(
    @Req()
    req: Request & { user: { userId: number | string }; username: string },
  ) {
    return this.jobService.getJobs(Number(req.user.userId));
  }

  @UseGuards(JwtGuard)
  @Get('job/:id')
  async getJobById(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    req: Request & { user: { userId: number | string }; username: string },
  ) {
    return this.jobService.getJobById(id, Number(req.user.userId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('create-job')
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @Req()
    req: Request & { user: { userId: number | string }; username: string },
  ) {
    return this.jobService.createJob(createJobDto, Number(req.user.userId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('update-job/:id')
  async updateJob(
    @Body() updateJobDto: UpdateJobDto,
    @Param('id', ParseIntPipe) jobId: number,
    @Req()
    req: Request & { user: { userId: number | string }; username: string },
  ) {
    return this.jobService.updateJob(
      jobId,
      updateJobDto,
      Number(req.user.userId),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('delete-job/:id')
  async deleteJob(
    @Param('id', ParseIntPipe) jobId: number,
    @Req()
    req: Request & { user: { userId: number | string }; username: string },
  ) {
    return this.jobService.deleteJob(jobId, Number(req.user.userId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('patch-update-job/:id')
  async patchJob(
    @Param('id', ParseIntPipe) jobId: number,
    @Body() patchJobDto: PatchJobDto,
    @Req()
    req: Request & { user: { userId: number | string }; username: string },
  ) {
    return this.jobService.patchJob(
      jobId,
      patchJobDto,
      Number(req.user.userId),
    );
  }
}
