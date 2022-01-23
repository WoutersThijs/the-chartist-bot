import mongoose from "mongoose";

function connect(){
    const dbUri = process.env.MONGO_URI as string;

    return mongoose
        .connect(dbUri as string)
        .then(() => {
            console.log("MongoDB connected.")
        })
        .catch((error) => {
            console.log("MongoDB connection failed. " + error)
            process.exit(1);
        });
}

export default connect;