import { Resolver, Query, Args, Mutation, Context, ResolveField, Parent, ResolveReference } from '@nestjs/graphql';
import { HomeLocality } from '../entity/home-locality.entity';
import { HomeLocalityService } from './locality.service';
import { GetLocalityArgs } from './arg/locality.args';
import { Logger } from '@logger/logger';

@Resolver((of: any) => HomeLocality)
export class HomeLocalityResolver {
  constructor(private homeLocalityService: HomeLocalityService, private readonly logger: Logger) {
  }

  @Query()
  async allLocalities() {
    return await this.homeLocalityService.listAll();
  }

  @Query()
  async locality(@Args('id') id: string) {
    return await this.homeLocalityService.getLocalityById(id);
  }

  @Mutation()
  async createLocality(@Args() args: GetLocalityArgs, @Context() context: any) {
    const { userid } = context.req.headers;
    return await this.homeLocalityService.createHomeLocality(args, userid);
  }

  @Mutation()
  async updateLocality(@Args('id') id: string, @Args() args: GetLocalityArgs) {
    return await this.homeLocalityService.updateHomeLocality(id, args);
  }

  @ResolveField()
  user(@Parent() locality: HomeLocality) {
    this.logger.http("ResolveField :: locality")
    return { __typename: 'User', id: locality.user_id };
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.homeLocalityService.getLocalityById(reference.id);
  }
}
