import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  Validate,
  IsString,
  IsEnum,
} from 'class-validator';
import { ClaimStatus } from '@prisma/client';
import { ValidateEnum } from 'src/claims/common/enum.validator';

export class QueryClaimDto {
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ example: 'open', enum: ClaimStatus })
  @IsOptional()
  @IsString()
  @IsEnum(ClaimStatus)
  @Validate(ValidateEnum, [ClaimStatus])
  status?: string;

  getNormalizedStatus(): ClaimStatus | undefined {
    if (!this.status) return undefined;

    const normalized = this.status.replace('-', '_').toUpperCase();

    if (!(normalized in ClaimStatus)) {
      return undefined;
    }

    return ClaimStatus[normalized as keyof typeof ClaimStatus];
  }
}
