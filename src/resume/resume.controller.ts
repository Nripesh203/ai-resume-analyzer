import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UpdateResumeDto } from '../dto/update-resume.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('resume')
  async getResume() {
    return this.resumeService.getResume();
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('resume/:id')
  async getResumeById(@Param('id', ParseIntPipe) id: number) {
    return this.resumeService.getResumeById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('create-resume')
  async createResume(
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
    @Body()
    createResumeDto: CreateResumeDto,
  ) {
    return this.resumeService.createResume(
      Number(req.user.userId),
      createResumeDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('update-resume/:id')
  async updateResume(
    @Req()
    req: Request & { user: { userId: string | number; username: string } },
    @Param('id', ParseIntPipe) resumeId: number,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.updateResume(
      Number(req.user.userId),
      resumeId,
      updateResumeDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('delete-resume/:id')
  async deleteResume(
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
    @Param('id', ParseIntPipe) resumeId: number,
  ) {
    return this.resumeService.deleteResume(Number(req.user.userId), resumeId);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          callback(
            new BadRequestException('Only PDF and DOCX file are accepted'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  @Post('resume/upload')
  async uploadResume(
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('A resume file is required.');
    }

    return this.resumeService.uploadResume(Number(req.user.userId), file);
  }
}
