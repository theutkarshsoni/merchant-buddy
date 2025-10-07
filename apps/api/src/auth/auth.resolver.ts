import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Mutation(() => String, { description: 'Returns a JWT' })
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<string> {
    return this.auth.validateAndSign(email, password);
  }
}
