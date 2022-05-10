import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
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
  async createHome(@Args('HomeInput') homeInput: any) {
    return this.homeService.createHome(homeInput);
  }

  @Mutation()
  async updateHome(@Args('id') id: string, @Args('HomeInput') homeInput: any) {
    return this.homeService.updateHome(id, homeInput);
  }
}
