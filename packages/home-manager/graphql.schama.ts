
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class Pokemon {
    id: string;
    name: string;
    type: string;
}

export abstract class IQuery {
    abstract pokemons(): Nullable<Pokemon[]> | Promise<Nullable<Pokemon[]>>;

    abstract pokemon(id?: Nullable<string>): Pokemon | Promise<Pokemon>;
}

export class Deleted {
    delete: boolean;
}

export abstract class IMutation {
    abstract create(name: string, type: string): Nullable<Pokemon> | Promise<Nullable<Pokemon>>;

    abstract update(id: string, name: string, type: string): Nullable<Pokemon> | Promise<Nullable<Pokemon>>;

    abstract delete(id: string): Nullable<Deleted> | Promise<Nullable<Deleted>>;
}

type Nullable<T> = T | null;
