import { Field, ID, Int, ObjectType, InputType, registerEnumType, GraphQLISODateTime } from '@nestjs/graphql';
import { TxStatus } from '@prisma/client';

registerEnumType(TxStatus, { name: 'TxStatus' });

@ObjectType()
export class Transaction {
  @Field(() => ID) 
  id!: string;

  @Field() 
  merchantId!: string;

  @Field(() => Int) 
  amountCents!: number;

  @Field() 
  currency!: string;

  @Field(() => TxStatus) 
  status!: TxStatus;

  @Field(() => String, { nullable: true }) 
  reference?: string | null;

  @Field(() => GraphQLISODateTime) 
  createdAt!: Date;
}

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true }) 
  endCursor?: string | null;

  @Field() 
  hasNextPage!: boolean;
}

@ObjectType()
export class TransactionEdge {
  @Field() 
  cursor!: string;

  @Field(() => Transaction) 
  node!: Transaction;
}

@ObjectType()
export class TransactionConnection {
  @Field(() => [TransactionEdge]) 
  edges!: TransactionEdge[];

  @Field(() => PageInfo) 
  pageInfo!: PageInfo;
}

@InputType()
export class TxFilterInput {
  @Field(() => TxStatus, { nullable: true }) 
  status?: TxStatus;

  @Field(() => GraphQLISODateTime, { nullable: true }) 
  from?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true }) 
  to?: Date;

  @Field(() => String, { nullable: true }) 
  merchantId?: string; // admins can override merchantId filter
}
