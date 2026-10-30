import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { UpdateResumeDto } from '../dto/update-resume.dto';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class ResumeService {
  constructor(
    @Inject('PG_POOL') private pool: Pool,
    private cloudinaryService: CloudinaryService,
  ) {}

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

    if (result.rows.length === 0)
      throw new NotFoundException(`Resume with ID ${id} not found.`);

    return result.rows[0];
  }

  async updateResume(
    userId: number,
    resumeId: number,
    updateResumeDto: UpdateResumeDto,
  ) {
    const query = `UPDATE resume
                   SET resume_text = $1
                   WHERE user_id = $2 AND resume_id = $3
                   RETURNING *`;

    const result = await this.pool.query(query, [
      updateResumeDto.resume_text,
      userId,
      resumeId,
    ]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Resume with ID ${resumeId} not found.`);

    return result.rows[0];
  }

  async deleteResume(userId: number, resumeId: number) {
    const query = `DELETE FROM resume
                   WHERE user_id = $1 AND resume_id = $2
                   RETURNING resume_id`;

    const result = await this.pool.query(query, [userId, resumeId]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Resume with ID ${resumeId} not found.`);

    return `Resume with ID ${resumeId} deleted successfully.`;
  }

  async uploadResume(userId: number, file: Express.Multer.File) {
    const asset = await this.cloudinaryService.uploadResume(file, userId);

    const query = `INSERT INTO resume_uploads(user_id, original_filename, object_key, mime_type, file_size_bytes)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING *`;

    try {
      const result = await this.pool.query(query, [
        userId,
        file.originalname,
        asset.publicId,
        file.mimetype,
        asset.bytes,
      ]);

      return result.rows[0];
    } catch (databaseError) {
      try {
        await this.cloudinaryService.deleteResume(asset.publicId);
      } catch (cleanupError) {
        throw new AggregateError(
          [databaseError, cleanupError],
          'Resume metadata insert failed, and Cloudinary cleanup failed.',
        );
      }

      throw databaseError;
    }
  }
}
