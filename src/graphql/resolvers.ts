import { IResolvers } from "@graphql-tools/utils";
import { getDb } from "../db/mongo";
import { signToken } from "../auth";
import { createTrainer, validateTrainer} from "../collections/trainers";
import { createPokemon, getPokemonById, getPokemons } from "../collections/pokemon";
import { catchPokemonParaTrainer, freeOwnedPokemons, getOwnedPokemonsByIds } from "../collections/ownedpokemons";
import { TRAINER_COLLECTION } from "../utils";
import { ObjectId } from "mongodb";
import { OwnedPokemon } from "../types/OwnedPokemon";


export const resolvers: IResolvers = {

    Query: {

        pokemons: async(_, {page, size}) => {
            return await getPokemons(page, size);
        },

        pokemon: async(_, {id}) => {
            return await getPokemonById(id);
        },

        me: async(_, __, { user }) => {
            if(!user) return null;
            
            return {
                _id: user._id.toString(),
                ...user,
                pokemons: user.pokemons || []
            }
        }

    },

    Mutation: {
        
        startJourney: async(_, {name, password}: {name: string, password: string}) => {
            const idDelTrainerCreado = await createTrainer(name, password);
            return signToken(idDelTrainerCreado);
        },

        login: async(_, {name, password}: {name: string, password: string}) => {
            const user = await validateTrainer(name, password);

            if(!user) throw new Error("Esos credenciales son incorrectos");
            return signToken(user._id.toString());
        },

        createPokemon: async(_, {name, description, height, weight, types}, {user}) => {
            if(!user) throw new Error ("Necesitas autenticarte para añadir un pokemon")

            return await createPokemon(name, description, height, weight, types)

        
        },

        catchPokemon: async(_, {pokemonId, nickname}, {user}) => {
            if(!user) throw new Error ("Tienes que estar logueado para capturar un Pokemon")

            const ownedP = await catchPokemonParaTrainer(user._id.toString(), pokemonId, nickname);
            return {
                _id: ownedP!._id.toString(), 
                pokemon: ownedP!.pokemon,
                nickname: ownedP!.nickname,
                attack: ownedP!.attack,
                defense: ownedP!.defense,
                speed: ownedP!.speed,
                special: ownedP!.special,
                level: ownedP!.level
            };
            
        },


        freePokemon: async(_, {ownedPokemonId}, {user}) => {
            if(!user) throw new Error ("Tienes que estar logueado para liberar un pokemon")
        
            await freeOwnedPokemons(user._id.toString(), ownedPokemonId);
            const db = getDb();

            const updatedTrainer = await db.collection(TRAINER_COLLECTION).findOne({_id: new ObjectId(user._id)})

            return {
                _id: updatedTrainer!._id.toString(),
                name: updatedTrainer!.name, 
                pokemons: updatedTrainer!.pokemons || []
            };
            
        }

    },


    Trainer: {
        pokemons: async (parent) => {
            if(!parent.pokemons || parent.pokemons.length===0) return [];

            return await getOwnedPokemonsByIds(parent.pokemons)

        }
    },

    OwnedPokemon: {
        pokemon: async(parent: OwnedPokemon) => {
            const db = getDb(); 

            return await getPokemonById(parent.pokemon.toString())
        }

    }
}