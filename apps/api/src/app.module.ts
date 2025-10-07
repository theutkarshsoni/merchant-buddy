import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { GqlModule } from './gql/gql.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [GqlModule, PrismaModule, TransactionsModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
