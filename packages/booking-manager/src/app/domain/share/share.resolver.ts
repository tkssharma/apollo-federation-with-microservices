import { AdminGuard } from '@app/auth/guards/admin.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { Logger } from '@logger/logger';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context, ResolveReference } from '@nestjs/graphql';
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
  async getAllShareForHome(@Args('homeId') homeId: string) {
    return await this.service.getAllShareForHome(homeId);
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getActiveShareCountForHome(@Args('homeId') homeId: string) {
    return await this.service.getActiveShareCountForHome(homeId);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createShareForHome(@Args('payload') shareInput: ShareDto) {
    return await this.service.createShareForHome(shareInput);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addNewShareForHome(@Args('payload') addNewShareInput: ShareDto) {
    return await this.service.addNewShareForHome(addNewShareInput);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateShareForHome(@Args('payload') updateShareInput: ShareDto) {
    return await this.service.updateShareForHome(updateShareInput);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async removeSharesForHome(@Args('payload') removeShareInput: ShareDto) {
    return await this.service.removeSharesForHome(removeShareInput);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    this.logger.http("ResolveReference :: share")
    return await this.service.getById(reference.id);
  }

  @ResolveField('home')
  home(@Parent() share: any) {
    return { __typename: 'Home', id: share.home_id };
  }

}
