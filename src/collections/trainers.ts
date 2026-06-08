import { getDb } from "../db/mongo";
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb";
import { TRAINER_COLLECTION } from "../utils";
import { getPokemonById } from "./pokemon";


export const createTrainer = async (name: string, password: string) => {
    const db = getDb();
    const passwordEncriptada = await bcrypt.hash(password, 10);

    const exists = await db.collection(TRAINER_COLLECTION).findOne({ name });                   
    if (exists) throw new Error("Ya existe un trainer con este nombre");

    else {
        const result = await db.collection(TRAINER_COLLECTION).insertOne({
        name, 
        password: passwordEncriptada
    });

    return result.insertedId.toString();
    }
    
}

export const validateTrainer = async (name: string, password: string) => {
    const db = getDb();
    const user = await db.collection(TRAINER_COLLECTION).findOne({name});

    if(!user) throw null;

    const comparacion = await bcrypt.compare(password, user.password);

    if(!comparacion) return null;

    return user;
}


export const catchPokemon = async (idDePokemon: string, userId: string) => {
    const db = getDb();

    const PokemonAnadir = await getPokemonById(idDePokemon);

    if(!PokemonAnadir) throw new Error("Este pokemon no existe");

    await db.collection(TRAINER_COLLECTION).updateOne({_id: new ObjectId(userId)},{
        $addToSet: {pokemons: idDePokemon}
    });

    const updatedTrainer= await db.collection(TRAINER_COLLECTION).findOne({_id: new ObjectId(userId)});
    return updatedTrainer;

}