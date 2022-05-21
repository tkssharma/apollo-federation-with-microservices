import { Logger } from '@logger/logger';
import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context, ResolveReference } from '@nestjs/graphql';
import { HomeLocality } from '../entity/home-locality.entity';
import { Home } from '../entity/home.entity';
import { HomeService } from './home.service';

@Resolver((of: any) => Home)
export class HomeResolver {
  constructor(private homeService: HomeService,
    private readonly logger: Logger) {
  }

  @Query()
  async homes() {
    return await this.homeService.listAll();
  }

  @Query()
  async findHomes(@Args('name') name: string) {
    return await this.homeService.findHome(name);
  }

  @Query()
  async activeHomes() {
    return await this.homeService.listAllActiveHomes();
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

  @ResolveField('user')
  user(@Parent() home: Home) {
    this.logger.http("ResolveField::user::HomeResolver" + home.user_id)
    return { __typename: 'User', id: home.user_id };
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    this.logger.http('Logging :: ResolveReference :: home')
    return await this.homeService.getByHomeId(reference.id);
  }

}
