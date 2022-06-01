import { RemoteGraphQLDataSource } from '@apollo/gateway';
import {
  Module,
  BadRequestException,
  HttpStatus,
  HttpException,
  UnauthorizedException,
  MiddlewareConsumer,
} from '@nestjs/common';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { verify, decode } from 'jsonwebtoken';
import { INVALID_AUTH_TOKEN, INVALID_BEARER_TOKEN } from './app.constants';
import { graphqlUploadExpress } from 'graphql-upload';
import FileUploadDataSource from '@profusion/apollo-federation-upload';

const getToken = (authToken: string): string => {
  const match = authToken.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new HttpException(
      { message: INVALID_BEARER_TOKEN },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return match[1];
};

const decodeToken = (tokenString: string) => {
  const decoded = verify(tokenString, process.env.SECRET_KEY);
  if (!decoded) {
    throw new HttpException(
      { message: INVALID_AUTH_TOKEN },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return decoded;
};
const handleAuth = ({ req }) => {
  try {
    if (req.headers.authorization) {
      const token = getToken(req.headers.authorization);
      const decoded: any = decodeToken(token);
      console.log(
        `userId: ${decoded.userId} permissions: ${decoded.permissions}`,
      );
      return {
        userId: decoded.userId,
        permissions: decoded.permissions,
        authorization: `${req.headers.authorization}`,
      };
    }
  } catch (err) {
    throw new UnauthorizedException(
      'User unauthorized with invalid authorization Headers',
    );
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
        buildService: ({ url }) =>
          new FileUploadDataSource({
            url,

            useChunkedTransfer: true,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('userId', context.userId);
              // for now pass authorization also
              request.http.headers.set('authorization', context.authorization);
              request.http.headers.set('permissions', context.permissions);
            },
          }),

        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'User', url: process.env.AUTH_API },
            { name: 'Home', url: process.env.HOME_MANAGER_API },
            { name: 'Booking', url: process.env.BOOKING_MANAGER_API },
          ],
        }),
      },
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
