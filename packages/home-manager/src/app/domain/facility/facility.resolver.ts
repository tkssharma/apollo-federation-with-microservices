import { Resolver, Query, Args, Mutation, Context, ResolveField, Parent, ResolveReference } from '@nestjs/graphql';
import { Homes } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-Facility.entity';
import { HomeFacilityService } from './facility.service';

@Resolver((of: any) => HomeFacility)
export class HomeFacilityResolver {
  constructor(private homeFacilityService: HomeFacilityService) {
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
    return { __typename: 'User', id: facility.user_id };
  }


  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.homeFacilityService.getFacilityById(reference.id);
  }
}
