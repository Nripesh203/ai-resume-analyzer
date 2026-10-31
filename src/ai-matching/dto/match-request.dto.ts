import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class MatchRequestDto {
  @ApiProperty({ example: 1, description: 'ID of the saved resume' })
  @IsInt()
  @Min(1)
  resumeId: number;

  @ApiProperty({ example: 1, description: 'ID of the saved job' })
  @Min(1)
  @IsInt()
  jobId: number;
}
