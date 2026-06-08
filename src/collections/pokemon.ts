import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { POKEMON_COLLECTION } from "../utils";
import { PokemonType } from "../types/PokemonType";
 

export const createPokemon= async( 
    name: string, 
    description: string, 
    height: string, 
    weight: string, 
    types: PokemonType[]) => {
    
    const db = getDb();

    const result = await db.collection(POKEMON_COLLECTION).insertOne({
        name,
        description,
        height,
        weight,
        types
    });

    const newPokemon = await getPokemonById(result.insertedId.toString());
    return newPokemon;

}


export const getPokemons = async (page?: number, size?: number) => {
    const db = getDb();
    page = page || 1;
    size = size || 10;

    return await db.collection(POKEMON_COLLECTION).find().skip((page-1) * size).limit(size).toArray();
}


export const getPokemonById = async(id: string) => {
    const db = getDb();

    const pokemon = await db.collection(POKEMON_COLLECTION).findOne({_id: new ObjectId(id),});

    if(!pokemon){
        throw new Error("No se ha podido identificar un Pokemon con este ID")
    }

    return pokemon;
}
