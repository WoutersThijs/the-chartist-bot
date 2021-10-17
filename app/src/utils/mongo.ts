import mongoose from "mongoose";

function connect(){
    const dbUri = process.env.MONGO_URI as string;

    return mongoose
        .connect("mongodb://thechartist:thechartist@mongodb:27017/thechartists?authSource=admin")
        .then(() => {
            console.log("MongoDB connected.")
        })
        .catch((error) => {
            console.log("MongoDB connection failed. " + error)
            process.exit(1);
        });
}

export default connect;