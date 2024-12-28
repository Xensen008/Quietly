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
        console.log(`Connecting to DB ${process.env.MONGOURI}`);
        const db = await mongoose.connect(process.env.MONGOURI || "", {})
        conection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB");
        // console.log('dbConnection',db)
        // console.log('connections',connections)

    } catch (error) {
        console.log("Error connecting to DB", error);
        process.exit(1)
    }
}

export default dbConnect;