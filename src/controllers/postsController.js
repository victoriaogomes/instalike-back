import * as fs from "fs";

import {addPost, getAllPosts, updatePostInfo} from "../models/postModel.js";
import generateDescriptionWithGemini from "../services/geminiService.js";

export async function listAllPosts(req, res) {
    // Retrieve all posts from the database
    const posts = await getAllPosts()

    // Send the retrieved posts as a JSON response with a 200 status code
    res.status(200)
        .json(posts);
}

export async function createPost(req, res) {
    const newPost = req.body;
    try {
        const createdPost = await addPost(newPost);

        return res.status(201).json(createdPost);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({error: error.message});
    }
}

export async function uploadImage(req, res) {
    const newPost = {
        description: "",
        imageUrl: req.file.originalname,
        imageAlt: ""
    };

    try {
        const createdPost = await addPost(newPost);
        const updatedImage = `uploads/${createdPost.insertedId}.png`

        fs.renameSync(req.file.path, updatedImage);
        res.status(200).json(createdPost);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({error: error.message});
    }
}

export async function updatePost(req, res) {
    const id = req.params.id;
    const imageUrl = `http://localhost:3000/${id}.png`;
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const description = await generateDescriptionWithGemini(imageBuffer);

        const post = {
            imageUrl: imageUrl,
            description: description,
            imageAlt: req.body.imageAlt,
        };
        const createdPost = await updatePostInfo(id, post);

        return res.status(201).json(createdPost);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({error: error.message});
    }
}