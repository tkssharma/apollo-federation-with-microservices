import { AdminGuard } from '@app/auth/guards/admin.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { Logger } from '@logger/logger';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context } from '@nestjs/graphql';
import { Share } from '../entity/shares.entity';
import { ShareDto } from './share.dto';
import { ShareService } from './share.service';

@Resolver((of: any) => Share)
export class ShareResolver {
  constructor(
    private service: ShareService,
    private readonly logger: Logger) {
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async shares() {
    return await this.service.listAll();
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async share(@Args('id') id: string) {
    return await this.service.getById(id);
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllShareForCustomer(@Args('id') userId: string) {
    return await this.service.getAllShareForCustomer(userId);
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllCustomersForHome(@Args('id') homeId: string) {
    return await this.service.getAllCustomersForHome(homeId);
  }


  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async removeCustomerShareForHome(@Args('payload') buyShareInput: ShareDto) {
    return await this.service.removeCustomerShareForHome(buyShareInput);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateCustomerShareForHome(@Args('payload') updateShareInput: ShareDto) {
    return await this.service.updateCustomerShareForHome(updateShareInput);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async buyCustomerShareForHome(@Args('payload') buyShareInput: ShareDto) {
    return await this.service.buyCustomerShareForHome(buyShareInput);
  }



  @ResolveField('home')
  home(@Parent() share: any) {
    return { __typename: 'Home', id: share.home_id };
  }


  @ResolveField('user')
  user(@Parent() share: any) {
    return { __typename: 'User', id: share.user_id };
  }
}
