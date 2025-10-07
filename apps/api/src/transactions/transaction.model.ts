import { Field, ID, Int, ObjectType, registerEnumType, GraphQLISODateTime } from '@nestjs/graphql';
import { TxStatus } from '@prisma/client';

registerEnumType(TxStatus, { name: 'TxStatus' });

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  merchantId!: string;

  @Field(() => Int)
  amountCents!: number;

  @Field(() => String)
  currency!: string;

  @Field(() => TxStatus)
  status!: TxStatus;

  @Field(() => String, { nullable: true })
  reference?: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
