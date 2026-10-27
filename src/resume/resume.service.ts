import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateResumeDto } from '../dto/create-resume.dto';

@Injectable()
export class ResumeService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async createResume(userId: number, createResumeDto: CreateResumeDto) {
    const query = `INSERT INTO resume (user_id, resume_text)
                       VALUES ($1, $2) RETURNING *`;

    const result = await this.pool.query(query, [
      userId,
      createResumeDto.resume_text,
    ]);

    return result.rows[0];
  }

  async getResume() {
    const query = `SELECT u.user_id , u.username, r.resume_text, u.created_at 
                   FROM users u
                   INNER JOIN resume r ON u.user_id = r.user_id;`;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getResumeById(id: number) {
    const query = `SELECT u.user_id , u.username, r.resume_text, u.created_at 
                   FROM users u
                   INNER JOIN resume r ON u.user_id = r.user_id
                   WHERE resume_id = $1`;

    const result = await this.pool.query(query, [id]);

    return result.rows[0];
  }
}
