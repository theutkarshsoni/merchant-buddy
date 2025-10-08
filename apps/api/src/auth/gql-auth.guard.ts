import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const { user } = GqlExecutionContext.create(ctx).getContext();
    return Boolean(user);
  }
}
