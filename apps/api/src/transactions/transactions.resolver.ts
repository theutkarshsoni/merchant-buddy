import { Resolver, Args, Int, Query } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction } from './transaction.model';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Transaction])
  async transactions(
    @Args('take', { type: () => Int, nullable: true }) take = 10,
    @Args('skip', { type: () => Int, nullable: true }) skip = 0
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip
    });
  }
}
