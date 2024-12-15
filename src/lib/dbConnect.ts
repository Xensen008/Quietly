import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:  number | null
}

const conection : ConnectionObject = {};

async function dbConnect(): Promise<void>{
    if(conection.isConnected){
        console.log("Already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODBURI || "", {})
        conection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB");

    } catch (error) {
        console.log("Error connecting to DB", error);
        process.exit(1)
    }
}

export default dbConnect;