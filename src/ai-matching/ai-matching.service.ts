import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { MatchRequestDto } from './dto/match-request.dto';

@Injectable()
export class AiMatchingService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async getMatchInputs(userId: number, matchRequestDto: MatchRequestDto) {
    const query = `SELECT resume_text
                   FROM resume
                   WHERE resume_id = $1 AND user_id = $2`;
    const resumeResult = await this.pool.query(query, [
      matchRequestDto.resumeId,
      userId,
    ]);

    const resume = resumeResult.rows[0];

    if (!resume) throw new NotFoundException('Resume not found.');

    const job_query = `SELECT *
                       FROM jobs
                       WHERE job_id = $1`;

    const jobResult = await this.pool.query(job_query, [matchRequestDto.jobId]);

    const job = jobResult.rows[0];

    if (!job) throw new NotFoundException(`Job not found.`);

    return { resumeText: resume.resume_text, job };
  }
}
