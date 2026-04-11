import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClaimsModule } from './claims/claims.module';

@Module({
  imports: [PrismaModule, ClaimsModule], // 👈 ADD HERE
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
