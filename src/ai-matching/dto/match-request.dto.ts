import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class MatchRequestDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the saved text resume',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  resumeId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID of an uploaded resume' })
  @IsOptional()
  @Min(1)
  @IsInt()
  resumeUploadId?: number;

  @ApiProperty({ example: 1, description: 'ID of the saved job' })
  @IsInt()
  @Min(1)
  jobId: number;
}
