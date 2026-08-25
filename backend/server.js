import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import usersRoute from "./routes/users.routes.js";



const app = express();
dotenv.config();


app.use(cors());
app.use(express.json());

app.use(postsRoutes);
app.use(usersRoute);
app.use(express.json());
app.use(express.static("uploads"));

const start = async ()=>{
    try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("momgoDb Connectes");

   app.listen (9000,()=>{
    console.log("server is Running  on port 9000");
   })
} catch (error) {
    console.log("mongodb Connected", error.message);
}
}
start(); 
