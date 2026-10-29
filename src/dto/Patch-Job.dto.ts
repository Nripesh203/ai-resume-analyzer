import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchJobDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  job_title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  requirements: string;
}
