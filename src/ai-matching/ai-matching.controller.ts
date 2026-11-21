import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AiMatchingService } from './ai-matching.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../common/guards/jwt.guard';
import { MatchRequestDto } from './dto/match-request.dto';

@Controller('api/ai-evaluations')
export class AiMatchingController {
  constructor(private readonly aiMatchingService: AiMatchingService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('match')
  async getMatchInputs(
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
    @Body() matchRequestdto: MatchRequestDto,
  ) {
    return this.aiMatchingService.match(
      Number(req.user.userId),
      matchRequestdto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('evaluations')
  async getEvaluations(
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
  ) {
    return this.aiMatchingService.getEvaluations(Number(req.user.userId));
  }
}
