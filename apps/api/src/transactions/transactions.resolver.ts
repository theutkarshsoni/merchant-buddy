import { Resolver, Args, Int, Query } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { TransactionConnection, TxFilterInput } from './transaction.types';

@Resolver()
export class TransactionsResolver {
  constructor(private prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => TransactionConnection)
  async transactions(
    @CurrentUser() user: any,
    @Args('first', { type: () => Int, nullable: true }) first = 20,
    @Args('after', { nullable: true }) after?: string,
    @Args('filter', { nullable: true }) filter?: TxFilterInput
  ): Promise<TransactionConnection> {

    const where: any = {};
    const isAdmin = user?.role === 'ADMIN';

    where.merchantId = isAdmin
      ? (filter?.merchantId ?? undefined)
      : (user?.merchantId ?? '__no_access__');

    if (filter?.status)
      where.status = filter.status;
    
    if (filter?.from || filter?.to) {
      where.createdAt = {
        gte: filter?.from ? new Date(filter.from) : undefined,
        lte: filter?.to ? new Date(filter.to) : undefined,
      };
    }

    const cursor = after ? { id: after } : undefined;

    const rows = await this.prisma.transaction.findMany({
      take: first + 1,
      ...(cursor ? { skip: 1, cursor } : {}),
      where,
      orderBy: { id: 'desc' },
    });

    const hasNextPage = rows.length > first;
    const nodes = hasNextPage ? rows.slice(0, -1) : rows;
    const edges = nodes.map((n) => ({ cursor: n.id, node: n }));
    const endCursor = nodes.length ? nodes[nodes.length - 1].id : null;

    return { edges, pageInfo: { endCursor, hasNextPage } };
  }
}
