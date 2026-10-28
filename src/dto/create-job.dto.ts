import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  job_title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  requirements: string;
}
