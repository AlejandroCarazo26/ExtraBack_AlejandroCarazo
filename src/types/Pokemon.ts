import { PokemonType } from "./PokemonType"


export type Pokemon = {
        _id?: string,
        name: string,
        description: string,
        height: number,
        weight: number,
        types: Array<PokemonType>
    }