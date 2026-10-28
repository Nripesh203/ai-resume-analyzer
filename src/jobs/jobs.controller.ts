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
import { JobService } from './jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UpdateJobDto } from '../dto/update-job.dto';

@Controller('api')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('jobs')
  async getJobs() {
    return this.jobService.getJobs();
  }

  @Get('job/:id')
  async getJobById(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getJobById(id);
  }

  @UseGuards(JwtGuard)
  @Post('create-job')
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @UseGuards(JwtGuard)
  @Put('update-job/:id')
  async updateJob(
    @Body() updateJobDto: UpdateJobDto,
    @Param('id', ParseIntPipe) jobId: number,
  ) {
    return this.jobService.updateJob(jobId, updateJobDto);
  }

  @UseGuards(JwtGuard)
  @Delete('delete-job/:id')
  async deleteJob(@Param('id', ParseIntPipe) jobId: number) {
    return this.jobService.deleteJob(jobId);
  }
}
