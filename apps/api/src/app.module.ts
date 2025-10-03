import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { GqlModule } from './gql/gql.module';

@Module({
  imports: [GqlModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
