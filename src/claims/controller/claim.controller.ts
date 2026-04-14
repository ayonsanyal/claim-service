import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Put,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClaimsService } from 'src/claims/service/claim.service';
import { CreateClaimDto } from 'src/claims/claim.dto';
import { UpdateClaimDto } from 'src/claims/update.claim.dto';
import { UpdateStatusDto } from 'src/claims/update.claim.status';
import { QueryClaimDto } from 'src/claims/query.claim.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('claims')
export class ClaimsController {
  constructor(private readonly service: ClaimsService) {}

  @Post()
  create(@Req() req, @Body() body: CreateClaimDto) {
    return this.service.create(body, req.user.userId);
  }

  @Get()
  findAll(@Req() req, @Query() query: QueryClaimDto) {
    return this.service.findAll(query, req.user.userId);
  }

  @Get('status')
  findAllByStatus(@Req() req, @Query() query: QueryClaimDto) {
    return this.service.findAllByStatus(query, req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.service.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateClaimDto,
  ) {
    return this.service.update(id, req.user.userId, body);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.service.delete(id, req.user.userId);
  }

  @Patch(':id/status')
  changeStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ) {
    return this.service.changeStatus(
      id,
      req.user.userId,
      body.toEnum(),
    );
  }
}