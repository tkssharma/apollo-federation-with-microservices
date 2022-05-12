import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { Homes } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';
import { HomeLocalityService } from './locality.service';
import { GetLocalityArgs } from './arg/locality.args';

@Resolver((of: any) => HomeLocality)
export class HomeLocalityResolver {
  constructor(private homeLocalityService: HomeLocalityService) {
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
    return this.homeLocalityService.updateHomeLocality(id, args);
  }
}
