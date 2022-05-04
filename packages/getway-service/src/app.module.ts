import { Module } from '@nestjs/common';
import { GraphQLGatewayModule } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

const handleAuth = ({ req }) => {
  const decoded: any = verify(req.headers.authorization, 'privateKey');
  return { userId: decoded.userId, permissions: decoded.permissions };
};
@Module({
  imports: [
    GraphQLGatewayModule.forRoot({
      server: {
        cors: true,
        playground: true,
        context: handleAuth,
      },
      gateway: {
        /* buildService: ({ name, url }) => {
           return new RemoteGraphQLDataSource({
             url,
             willSendRequest({ request, context }) {
               request.http.headers.set('userId', context.userId)
               request.http.headers.set('permissions', context.permissions)
             }
           })
         }, */
        serviceList: [
          // list of services
          { name: 'User', url: 'http://127.0.0.1:3000/graphql-federated' },
          { name: 'Pokemon', url: 'http://127.0.0.1:3001/graphql-federated' },
        ],
      },
    }),
  ],
})
export class AppModule {}
