import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { PatchJobDto } from '../dto/Patch-Job.dto';

@Injectable()
export class JobService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async getJobs() {
    const query = `SELECT * FROM jobs`;

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getJobById(id: number) {
    const query = `SELECT * FROM jobs 
                   WHERE job_id = $1`;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${id} not found.`);

    return result.rows[0];
  }

  async createJob(createJobDto: CreateJobDto) {
    const query = `INSERT INTO jobs (job_title, description, requirements)
                   VALUES ($1, $2, $3) 
                   RETURNING *`;

    const result = await this.pool.query(query, [
      createJobDto.job_title,
      createJobDto.description,
      createJobDto.requirements,
    ]);

    return result.rows[0];
  }

  async updateJob(jobId: number, updateJobDto: UpdateJobDto) {
    const query = `UPDATE jobs
                   SET job_title = $1, description = $2, requirements = $3
                   WHERE job_id = $4
                   RETURNING *`;

    const result = await this.pool.query(query, [
      updateJobDto.job_title,
      updateJobDto.description,
      updateJobDto.requirements,
      jobId,
    ]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${jobId} not found.`);

    return result.rows[0];
  }

  async patchJob(jobId: number, patchJobDto: PatchJobDto) {
    const query = `UPDATE jobs
                   SET job_title = COALESCE($1, job_title),
                    description =COALESCE($2, description),
                     requirements = COALESCE($3, requirements)
                   WHERE job_id = $4
                   RETURNING *`;

    const result = await this.pool.query(query, [
      patchJobDto.job_title,
      patchJobDto.description,
      patchJobDto.requirements,
      jobId,
    ]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${jobId} not found.`);

    return result.rows[0];
  }

  async deleteJob(jobId: number) {
    const query = `DELETE FROM jobs
                   WHERE job_id = $1
                   RETURNING job_id`;

    const result = await this.pool.query(query, [jobId]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Job with ID ${jobId} not found.`);

    return `Job with ID ${jobId} deleted successfully.`;
  }
}
