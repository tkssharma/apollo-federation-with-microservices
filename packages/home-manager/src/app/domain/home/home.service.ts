import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../entity/home.entity';
import { CreatePokemonDto } from './home.dto';

@Injectable()
export class PokemonService {
  constructor(@InjectRepository(PokemonEntity) private readonly pokemonRepository: Repository<PokemonEntity>
  ) {
  }

  async createPokemon(data: CreatePokemonDto): Promise<PokemonEntity> {
    let pokemon = new PokemonEntity();
    pokemon.name = data.name;
    pokemon.type = data.type;
    await pokemon.save();
    return pokemon;
  }

  async delete(id: string): Promise<PokemonEntity> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });
    await this.pokemonRepository.delete(id);
    return pokemon!;
  }

  async update(id: string, data: CreatePokemonDto): Promise<PokemonEntity> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });
    pokemon!.name = data.name;
    pokemon!.type = data.type;
    await pokemon!.save();
    return pokemon!;
  }
  // assign league to the pokemon 
  async assignLeague(id: string, leagueId: string) {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });
    return pokemon;
  }

  async show(id: string) {
    return await this.pokemonRepository.findOne({ where: { id } });
  }

  async getPokemons() {
    return await this.pokemonRepository.find({});
  }
}
