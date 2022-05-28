import { AuthModule } from '@app/auth/auth.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entity/booking.entity';
import { ShareResolver } from './share.resolver';
import { DateScalar } from './scalars/date.scalar';
import { Share } from '../entity/shares.entity';
import { ShareService } from './share.service';

@Module({
  imports: [AuthModule, LoggerModule, TypeOrmModule.forFeature([Share])],
  providers: [ShareService, ShareResolver, DateScalar],
})
export class HomeSharesModule {
}
