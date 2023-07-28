import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms";

const connectionToDB = async () => {
    try {
        const { connection } = await mongoose.connect(MONGO_URI);

        if (connection) {
            console.log(`connected to DB : ${connection.host} `);
        }
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

export default connectionToDB;