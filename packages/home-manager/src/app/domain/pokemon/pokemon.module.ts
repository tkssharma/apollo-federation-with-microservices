import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonResolver } from './pokemon.resolver';
import { PokemonEntity } from '../entity/pokemon.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PokemonEntity])],
  providers: [PokemonService, PokemonResolver],
})
export class PokemonModule {
}
