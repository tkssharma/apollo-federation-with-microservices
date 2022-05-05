import { Module } from '@nestjs/common';
import { PokemonService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonResolver } from './home.resolver';
import { HomeEntity } from '../entity/home.entity';


@Module({
  imports: [TypeOrmModule.forFeature([HomeEntity])],
  providers: [PokemonService, PokemonResolver],
})
export class HomeModule {
}
