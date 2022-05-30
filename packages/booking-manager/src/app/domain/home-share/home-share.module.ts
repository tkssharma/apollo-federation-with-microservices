import { AuthModule } from '@app/auth/auth.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entity/booking.entity';
import { ShareResolver } from './home-share.resolver';
import { DateScalar } from './scalars/date.scalar';
import { HomeShare } from '../entity/home-shares.entity';
import { ShareService } from './home-share.service';
import { Share } from '../entity/shares.entity';

@Module({
  imports: [AuthModule, LoggerModule, TypeOrmModule.forFeature([HomeShare, Share])],
  providers: [ShareService, ShareResolver, DateScalar],
})
export class HomeSharesModule {
}
