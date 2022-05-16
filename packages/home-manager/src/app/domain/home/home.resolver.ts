import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context, ResolveReference } from '@nestjs/graphql';
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
    return await this.homeService.createHome(args, userid);
  }

  @Mutation()
  async updateHome(@Args('id') id: string, @Args() args: any) {
    return await this.homeService.updateHome(id, args);
  }
  @ResolveField()
  locality(@Parent() home: Homes) {
    return { __typename: 'HomeLocality', id: home.locality.id };
  }

  @ResolveField()
  facilities(@Parent() home: Homes) {
    return { __typename: 'HomeFacilityMapping', id: home.id };
  }

  @ResolveField()
  user(@Parent() home: Homes) {
    return { __typename: 'User', id: home.user_id };
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return await this.homeService.getByHomeId(reference.id);
  }

}
