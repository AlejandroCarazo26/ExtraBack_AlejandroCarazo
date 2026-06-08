import jwt from "jsonwebtoken";
import { getDb } from "./db/mongo";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import { TRAINER_COLLECTION } from "./utils";


dotenv.config();

const SUPER_SECRET1= process.env.SUPER_SECRET;

export const signToken = (userId: string) => {
    
    if(!SUPER_SECRET1) throw new Error("No hay secreto que produzca un token")

    return jwt.sign({userId}, SUPER_SECRET1!, {expiresIn: "1h"});
}

export const verifyToken = (token: string) => {
    try{
        if(!SUPER_SECRET1) throw new Error("No hay secreto que produzca un token")
        return jwt.verify(token, SUPER_SECRET1!) as {userId : string};
    }
    catch(err){
        return null;
    }
};


export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);

    if(!payload) return null;

    const db = getDb();
    return await db.collection(TRAINER_COLLECTION).findOne({
        _id: new ObjectId (payload.userId)
    });
}