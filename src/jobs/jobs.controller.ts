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
import { RolesGuard } from '../common/guards/roles.guard';
import { ROLES } from '../auth/decorators/roles.decorator';

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

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @ROLES('admin', 'staff')
  @Post('create-job')
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @ROLES('admin', 'staff')
  @Put('update-job/:id')
  async updateJob(
    @Body() updateJobDto: UpdateJobDto,
    @Param('id', ParseIntPipe) jobId: number,
  ) {
    return this.jobService.updateJob(jobId, updateJobDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @ROLES('admin', 'staff')
  @Delete('delete-job/:id')
  async deleteJob(@Param('id', ParseIntPipe) jobId: number) {
    return this.jobService.deleteJob(jobId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @ROLES('admin', 'staff')
  @Patch('patch-update-job/:id')
  async patchJob(
    @Param('id', ParseIntPipe) jobId: number,
    @Body() patchJobDto: PatchJobDto,
  ) {
    return this.jobService.patchJob(jobId, patchJobDto);
  }
}
