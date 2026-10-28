import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateResumeDto {
  @IsNotEmpty()
  @IsString()
  resume_text: string;
}
