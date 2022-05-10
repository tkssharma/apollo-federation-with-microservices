import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { Module, BadRequestException } from '@nestjs/common';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

const handleAuth = ({ req }) => {
  try {
    if (req.headers.authorization) {
      console.log(req.headers.authorization);
      const decoded: any = verify(req.headers.authorization, 'HELLODEMO');
      return { userId: decoded.userId, permissions: decoded.permissions };
    }
  } catch (err) {
    throw new BadRequestException();
  }
};
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      server: {
        context: handleAuth,
      },
      driver: ApolloGatewayDriver,
      gateway: {
        buildService: ({ name, url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('userId', context.userId);
              request.http.headers.set('permissions', context.permissions);
            },
          });
        },
        serviceList: [
          { name: 'user', url: 'http://localhost:3000/graphql-federated' },
        ],
      },
    }),
    /* GraphQLGatewayModule.forRoot({
      server: {
        cors: true,
        context: handleAuth,
      },
      gateway: {
        buildService: ({ name, url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              request.http.headers.set('userId', context.userId)
              request.http.headers.set('permissions', context.permissions)
            }
          })
        },
        serviceList: [
          // list of services
  
        ],
      },
    }), */
  ],
})
export class AppModule {}
