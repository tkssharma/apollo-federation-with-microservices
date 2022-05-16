import { Resolver, Query, Args, Mutation, Context, ResolveField, Parent, ResolveReference } from '@nestjs/graphql';
import { FacilitiesMapping } from '../entity/facilities.entity';
import { HomeFacilityMappingService } from './facility-mapping.service';

@Resolver((of: any) => FacilitiesMapping)
export class HomeFacilityResolver {
  constructor(private homeFacilityMappingService: HomeFacilityMappingService) {
  }
  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.homeFacilityMappingService.getFacilityById(reference.id);
  }
}
