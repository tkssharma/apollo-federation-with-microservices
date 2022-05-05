import { Module } from '@nestjs/common';
import { PokemonService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonResolver } from './home.resolver';
import { PokemonEntity } from '../entity/home.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PokemonEntity])],
  providers: [PokemonService, PokemonResolver],
})
export class PokemonModule {
}
