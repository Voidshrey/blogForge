import mongoose from "mongoose";

async function db() {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`db connected on ${conn.connection.port}`);
    } catch (error) {
        console.log(error.message);
    }
}

export default db;