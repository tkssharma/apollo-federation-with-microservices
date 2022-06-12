import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './users.resolvers';
import { DateScalar } from '../scalars/date.scalar';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/users.entity';
import { LoggerModule } from '../logger/logger.module';
import EventEmitter from 'events';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersEventService } from './user.event.service';
import { HttpProxyModule } from '../http/http.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    EventEmitterModule.forRoot(),
    HttpProxyModule,
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
  controllers: [],
  providers: [UsersService, UserResolver, DateScalar, UsersEventService],
})
export class UsersModule { }
