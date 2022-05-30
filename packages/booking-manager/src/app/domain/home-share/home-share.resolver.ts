import { AdminGuard } from '@app/auth/guards/admin.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { Logger } from '@logger/logger';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context, ResolveReference } from '@nestjs/graphql';
import { HomeShare } from '../entity/home-shares.entity';
import { ShareDto } from './home-share.dto';
import { ShareService } from './home-share.service';

@Resolver((of: any) => HomeShare)
export class ShareResolver {
  constructor(
    private service: ShareService,
    private readonly logger: Logger) {
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async homeShares() {
    return await this.service.listAll();
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async homeShare(@Args('id') id: string) {
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

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllActiveCustomers() {
    return await this.service.getAllActiveCustomers();
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

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    this.logger.http("ResolveReference :: home-share")
    return await this.service.getById(reference.id);
  }

  @ResolveField('home')
  home(@Parent() share: any) {
    return { __typename: 'Home', id: share.home_id };
  }

  @ResolveField('share')
  async share(@Parent() share: any) {
    return await this.service.getShareById(share.share_id);
  }

  @ResolveField('user')
  user(@Parent() share: any) {
    return { __typename: 'User', id: share.user_id };
  }
}
