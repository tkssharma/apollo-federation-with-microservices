import { AdminGuard } from '@app/auth/guards/admin.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { Logger } from '@logger/logger';
import { ConsoleLogger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context, ResolveReference } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { HomeLocality } from '../entity/home-locality.entity';
import { Home } from '../entity/home.entity';
import { HomeService } from './home.service';
import * as fs from 'fs/promises';

@Resolver((of: any) => Home)
export class HomeResolver {
  constructor(private homeService: HomeService,
    private readonly logger: Logger) {
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async homes() {
    return await this.homeService.listAll();
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findHomes(@Args('name') name: string) {
    return await this.homeService.findHome(name);
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async activeHomes() {
    return await this.homeService.listAllActiveHomes();
  }


  @Query()
  async home(@Args('id') id: string) {
    return await this.homeService.getById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createHome(@Args() args: any, @Context() context: any) {
    const { userid } = context.req.headers;
    return await this.homeService.createHome(args, userid);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateHome(@Args('id') id: string, @Args() args: any) {
    return await this.homeService.updateHome(id, args);
  }

  @ResolveField('user')
  user(@Parent() home: Home) {
    this.logger.http("ResolveField::user::HomeResolver" + home.user_id)
    return { __typename: 'User', id: home.user_id };
  }
  /*
  @ResolveField('display_images')
  displayImages(@Parent() home: Home) {
    this.logger.http("ResolveField::display_images::FileResolver" + home.id)
    //return { __typename: "FileList", idRef: home.id }
    return { __typename: "File", idRef: home.id }
  }

  @ResolveField('original_images')
  originalImages(@Parent() home: Home) {
    this.logger.http("ResolveField::original_images::FileResolver" + home.id)
    // return { __typename: "FileList", idRef: home.id }
    return { __typename: "File", idRef: home.id }
  } */

  @ResolveField('display_images')
  displayImages(@Parent() home: Home) {
    this.logger.http("ResolveField::file::FileResolver" + home.id)
    return { __typename: 'File', id: home.id };
  }

  @ResolveField('original_images')
  originalImages(@Parent() home: Home) {
    this.logger.http("ResolveField::file::FileResolver" + home.id)
    return { __typename: 'File', id: home.id };
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    this.logger.http('Logging :: ResolveReference :: home')
    return await this.homeService.getByHomeId(reference.id);
  }

}
