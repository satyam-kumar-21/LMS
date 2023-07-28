import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectionToDB from './config/dbConnection.js';

const PORT = process.env.PORT || 4044;

app.listen(PORT, async ()=>{
    await connectionToDB();
    console.log(`Server running on http:localhost:${PORT}`);
});