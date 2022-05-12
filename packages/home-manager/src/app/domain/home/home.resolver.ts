import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context } from '@nestjs/graphql';
import { HomeLocality } from '../entity/home-locality.entity';
import { Homes } from '../entity/home.entity';
import { HomeService } from './home.service';

@Resolver((of: any) => Homes)
export class HomeResolver {
  constructor(private homeService: HomeService) {
  }

  @Query()
  async homes() {
    return await this.homeService.listAll();
  }

  @Query()
  async home(@Args('id') id: string) {
    return await this.homeService.getById(id);
  }

  @Mutation()
  async createHome(@Args() args: any, @Context() context: any) {
    const { userid } = context.req.headers;
    return this.homeService.createHome(args, userid);
  }

  @Mutation()
  async updateHome(@Args('id') id: string, @Args() args: any) {
    return this.homeService.updateHome(id, args);
  }
  @ResolveField('locality')
  getLocality(@Parent() home: any) {
    console.log(home);
    return { __typename: 'HomeLocality', id: home.home_locality_id };
  }

  @ResolveField('user')
  getUser(@Parent() home: any) {
    return { __typename: 'User', id: home.user_id };
  }
}
