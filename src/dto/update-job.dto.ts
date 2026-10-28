import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateJobDto {
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
