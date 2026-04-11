import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClaimDto {
  @ApiProperty({ example: 'Damaged Window' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Accident caused the window to be damaged for hyundayi',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
