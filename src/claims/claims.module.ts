import { Module } from '@nestjs/common';
import { ClaimsController } from 'src/claims/controller/claim.controller';
import { ClaimsService } from 'src/claims/service/claim.service';
import { ClaimsRepository } from 'src/claims/repository/claim.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ClaimsGrpcController } from 'src/claims/controller/claims.grpc.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClaimsController, ClaimsGrpcController],
  providers: [ClaimsService, ClaimsRepository],
  exports: [ClaimsService],
})
export class ClaimsModule {}
