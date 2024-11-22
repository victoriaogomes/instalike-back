import express from "express";
import multer from "multer";
import {createPost, listAllPosts, updatePost, uploadImage} from "../controllers/postsController.js";
import cors from "cors";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({dest: "./uploads", storage})

const routes = (app) => {
    // Middleware to parse JSON request bodies
    app.use(express.json());
    app.use(cors(corsOptions));

    // Define a GET route to fetch all posts
    app.get('/posts', listAllPosts);
    app.post('/posts', createPost);
    app.post('/upload', upload.single('image'), uploadImage);
    app.put('/upload/:id', updatePost)
}

export default routes;

