import { OwnedPokemon } from "./OwnedPokemon"


export type Trainer = {
        _id?: string,
        name: string,
        //En base datos se guardará solo el id, encadenado OwnedPokemon.
        pokemons: Array<OwnedPokemon>
    }