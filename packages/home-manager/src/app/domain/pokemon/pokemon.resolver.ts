import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PokemonEntity } from '../entity/pokemon.entity';
import { PokemonService } from './pokemon.service';

@Resolver(PokemonEntity)
export class PokemonResolver {
  constructor(private pokemonService: PokemonService) {
  }

  @Query()
  async pokemons() {
    return await this.pokemonService.getPokemons();
  }

  @Mutation()
  async create(@Args('name') name: any, @Args('type') type: any) {
    return this.pokemonService.createPokemon({ name, type });
  }

  @Mutation()
  async update(@Args('id') id: any, @Args('name') name: any, @Args('type') type: any) {
    return this.pokemonService.update(id, { name, type });
  }


  @Mutation()
  async delete(@Args('id') id: any) {
    await this.pokemonService.delete(id);
    return { delete: true };
  }

  @Query()
  async pokemon(@Args('id') id: string) {
    return await this.pokemonService.show(id);
  }
}
