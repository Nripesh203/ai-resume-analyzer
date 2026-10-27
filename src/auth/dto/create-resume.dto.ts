import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty()
  @IsString()
  resume_text: string;
}
