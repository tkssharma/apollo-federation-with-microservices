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
    return await this.homeFacilityService.createHomeFacility(args);
  }

  @Mutation()
  async addFacilityToHome(
    @Args('facility_id') facility_id: string,
    @Args('home_id') home_id: string) {
    return this.homeFacilityService.addFacilityToHome(facility_id, home_id);
  }

  @Mutation()
  async updateFacility(@Args('id') id: string, @Args() args: any) {
    return this.homeFacilityService.updateHomeFacility(id, args);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.homeFacilityService.getFacilityById(reference.id);
  }
}
