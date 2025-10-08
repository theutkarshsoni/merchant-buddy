import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  return gqlCtx.getContext().user as {
    sub: string; 
    role: 'ADMIN'|'MERCHANT_OWNER'|'SUPPORT'; 
    merchantId?: string|null; 
    email: string;
  } | null;
});
