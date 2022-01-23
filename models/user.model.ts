import mongoose from "mongoose";

export interface UserInput{
    discord_id: string;
    username: string; 
}

export interface UserDocument extends UserInput, mongoose.Document{
    createdAt: Date;
    updatedAt: Date;   
}

const UserSchema = new mongoose.Schema(
    {
        discord_id: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<UserDocument>("User", UserSchema);