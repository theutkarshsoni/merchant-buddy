import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HelloResolver } from './hello.resolver';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  sub: string;
  role: 'ADMIN' | 'MERCHANT_OWNER' | 'SUPPORT';
  merchantId?: string | null;
  email: string;
};

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      path: '/graphql',
      context: (ctx) => {
        const req = ctx?.raw;
        const header = req.headers['authorization'];
        const bearer = Array.isArray(header) ? header[0] : header;
        let user: JwtPayload | null = null;
        if (bearer?.startsWith('Bearer ')) {
          const token = bearer.slice('Bearer '.length);
          try {
            user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
          } catch {
            user = null;
          }
        }
        return { ...ctx, user };
      },
    }),
  ],
  providers: [HelloResolver],
})
export class GqlModule {}
