import { ApiProperty } from '@nestjs/swagger';
import { IsString, Validate } from 'class-validator';
import { ClaimStatus } from '@prisma/client';
import { ValidateEnum } from 'src/claims/common/enum.validator';

export class UpdateStatusDto {
  @ApiProperty({
    enum: ClaimStatus,
    example: 'open',
  })
  @IsString()
  @Validate(ValidateEnum, [ClaimStatus])
  status: string;

  // 🔥 Always safe (required field)
  toEnum(): ClaimStatus {
    return this.status.toUpperCase() as ClaimStatus;
  }
}
