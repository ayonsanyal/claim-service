import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClaimsModule } from './claims/claims.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, ClaimsModule],
  providers: [AppService],
})
export class AppModule {}
