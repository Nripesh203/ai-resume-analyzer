import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { PatchJobDto } from '../dto/Patch-Job.dto';

@Injectable()
export class JobService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async getJobs(userId: number) {
    const query = `SELECT * FROM jobs
                   WHERE user_id = $1`;

    const result = await this.pool.query(query, [userId]);

    return result.rows;
  }

  async getJobById(id: number, userId: number) {
    const query = `SELECT * FROM jobs 
                   WHERE job_id = $1 AND user_id = $2`;

    const result = await this.pool.query(query, [id, userId]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${id} not found.`);

    return result.rows[0];
  }

  async createJob(createJobDto: CreateJobDto, userId: number) {
    const query = `INSERT INTO jobs (job_title, description, requirements, user_id)
                   VALUES ($1, $2, $3, $4) 
                   RETURNING *`;

    const result = await this.pool.query(query, [
      createJobDto.job_title,
      createJobDto.description,
      createJobDto.requirements,
      userId,
    ]);

    return result.rows[0];
  }

  async updateJob(jobId: number, updateJobDto: UpdateJobDto, userId: number) {
    const query = `UPDATE jobs
                   SET job_title = $1, description = $2, requirements = $3
                   WHERE job_id = $4 AND user_id = $5
                   RETURNING *`;

    const result = await this.pool.query(query, [
      updateJobDto.job_title,
      updateJobDto.description,
      updateJobDto.requirements,
      jobId,
      userId,
    ]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${jobId} not found.`);

    return result.rows[0];
  }

  async patchJob(jobId: number, patchJobDto: PatchJobDto, userId: number) {
    const query = `UPDATE jobs
                   SET job_title = COALESCE($1, job_title),
                    description =COALESCE($2, description),
                     requirements = COALESCE($3, requirements)
                   WHERE job_id = $4  AND user_id = $5
                   RETURNING *`;

    const result = await this.pool.query(query, [
      patchJobDto.job_title,
      patchJobDto.description,
      patchJobDto.requirements,
      jobId,
      userId,
    ]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${jobId} not found.`);

    return result.rows[0];
  }

  async deleteJob(jobId: number, userId: number) {
    const query = `DELETE FROM jobs
                   WHERE job_id = $1 AND user_id = $2
                   RETURNING job_id`;

    const result = await this.pool.query(query, [jobId, userId]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${jobId} not found.`);

    return `Job with ID ${jobId} deleted successfully.`;
  }
}
