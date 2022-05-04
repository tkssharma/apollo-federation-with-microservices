import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLGatewayModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLGatewayModule.forRoot({
      server: {
        cors: true,
        playground: true,
      },
      gateway: {
        serviceList: [
          // list of services
          { name: 'User', url: 'http://127.0.0.1:3000/graphql-federated' },
          { name: 'Pokemon', url: 'http://127.0.0.1:3001/graphql-federated' },

        ],
      },
    }),
  ],
})
export class AppModule { }
