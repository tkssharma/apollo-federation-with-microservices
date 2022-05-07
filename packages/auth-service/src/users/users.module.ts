import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './users.resolvers';
import { DateScalar } from '../scalars/date.scalar';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
  controllers: [],
  providers: [UsersService, UserResolver, DateScalar],
})
export class UsersModule { }
