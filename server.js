import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectionToDB from './config/dbConnection.js';
import cloudinary from "cloudinary";


const PORT = process.env.PORT || 4044;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'drgktyioo';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '166768164512464';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'XEU0phaPUssQ3hzqLVUcY9UdkLs' ;

cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

app.listen(PORT, async ()=>{
    await connectionToDB();
    console.log(`Server running on http:localhost:${PORT}`);
});