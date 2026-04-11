import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Validate } from 'class-validator';
import { ClaimStatus } from '@prisma/client';
import { ValidateEnum } from 'src/claims/common/enum.validator';

export class UpdateClaimDto {
  @ApiPropertyOptional({ example: 'Updated title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ClaimStatus,
    example: ClaimStatus.IN_REVIEW,
  })
  @IsOptional()
  @IsString()
  @Validate(ValidateEnum, [ClaimStatus])
  status?: ClaimStatus;

  // helper to convert to enum
  getNormalizedStatus(): ClaimStatus | undefined {
    return this.status ? (this.status.toUpperCase() as ClaimStatus) : undefined;
  }
}
