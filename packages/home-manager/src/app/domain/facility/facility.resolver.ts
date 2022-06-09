import { Resolver, Query, Args, Mutation, Context, ResolveField, Parent, ResolveReference } from '@nestjs/graphql';
import { Home } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-facility.entity';
import { HomeFacilityService } from './facility.service';
import { Logger } from '@logger/logger';

@Resolver((of: any) => HomeFacility)
export class HomeFacilityResolver {
  constructor(private homeFacilityService: HomeFacilityService, private readonly logger: Logger) {
  }

  @Query()
  async allFacilities() {
    return await this.homeFacilityService.listAll();
  }

  @Query()
  async facility(@Args('id') id: string) {
    return await this.homeFacilityService.getFacilityById(id);
  }

  @Mutation()
  async createFacility(@Args() args: any, @Context() context: any) {
    const { userid } = context.req.headers;
    return await this.homeFacilityService.createHomeFacility(args, userid);
  }

  @Mutation()
  async updateFacility(@Args('id') id: string, @Args() args: any) {
    return this.homeFacilityService.updateHomeFacility(id, args);
  }

  @ResolveField()
  user(@Parent() facility: any) {
    this.logger.http("ResolveField :: facility")
    return { __typename: 'User', id: facility.user_id };
  }


  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.homeFacilityService.getFacilityById(reference.id);
  }

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
}
