import { Module } from '@nestjs/common';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  providers: [TransactionsResolver]
})
export class TransactionsModule {}
