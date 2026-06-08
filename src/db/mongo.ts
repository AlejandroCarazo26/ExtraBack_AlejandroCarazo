import {Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { dbName } from "../utils";

dotenv.config();


let client: MongoClient;
let miBaseDeDatosBonita: Db;

export const connectToMongo = async() => {
    try{

        const mongoUrl = process.env.MONGO_URL;
        if(!mongoUrl) throw new Error ("No has metido la url de mongo, mongolo");

        client = new MongoClient(mongoUrl);
        await client.connect();
        miBaseDeDatosBonita = client.db(dbName);

        console.log("Conectadísimo a Mongo majete");

    }
    catch(err){
        console.log("Error de mondongo majete: ", err);
    }

}

export const getDb = () : Db => miBaseDeDatosBonita;