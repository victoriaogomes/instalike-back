// Connect to the database using the provided connection string
import connectToDb from "../config/dbConfig.js";
import {ObjectId} from "mongodb";
import 'dotenv/config';

const dbConnection = await connectToDb(process.env.CONNECTION_STRING);

export async function getAllPosts() {
    const db = dbConnection.db("imersao-instabytes");
    const collection = db.collection("posts");

    return collection.find().toArray();
}

export async function addPost(newPost) {
    const db = dbConnection.db("imersao-instabytes");
    const collection = db.collection("posts");

    return collection.insertOne(newPost);
}

export async function updatePostInfo(id, post) {
    const db = dbConnection.db("imersao-instabytes");
    const collection = db.collection("posts");
    const objectId = ObjectId.createFromHexString(id);
    return collection.updateOne({_id: new ObjectId(objectId)}, {$set: post});
}