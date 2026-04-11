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
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ClaimsService } from 'src/claims/service/claim.service';
import { CreateClaimDto } from 'src/claims/claim.dto';
import { UpdateClaimDto } from 'src/claims/update.claim.dto';
import { UpdateStatusDto } from 'src/claims/update.claim.status';
import { QueryClaimDto } from 'src/claims/qury.claim.dto';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly service: ClaimsService) {}

  @Post()
  @ApiQuery({ name: 'name', required: true, type: String })
  @ApiQuery({ name: 'description', required: true, type: String })
  create(@Body() body: CreateClaimDto) {
    return this.service.create(body);
  }

  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @Get()
  findAll(@Query() query: QueryClaimDto) {
    return this.service.findAll(query);
  }

  @Get('status')
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @ApiQuery({ name: 'status', required: true, type: String })
  findAllByStatus(@Query() query: QueryClaimDto) {
    return this.service.findAllByStatus(query);
  }

  @ApiQuery({ name: 'id', required: true, type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiQuery({ name: 'id', required: true, type: String })
  update(@Param('id') id: string, @Body() body: UpdateClaimDto) {
    return this.service.update(id, body.getNormalizedStatus());
  }

  @Delete(':id')
  @ApiQuery({ name: 'id', required: true, type: String })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Patch(':id/status')
  @ApiQuery({ name: 'id', required: true, type: String })
  changeStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.service.changeStatus(id, body.toEnum());
  }
}
