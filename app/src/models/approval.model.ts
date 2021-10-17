import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export enum Status {
    waiting = 'waiting',
    approved = 'approved',
    denied = 'denied'
}

export interface ApprovalInput{
    user: UserDocument['_id'];
    message: String;
    // status: Status;
}

export interface ApprovalDocument extends ApprovalInput, mongoose.Document{
    createdAt: Date;
    updatedAt: Date;   
}

const ApprovalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String,
            required: true
        }
        // status: {
        //     type: Status,
        //     default: Status.waiting
        // }
    },
    { timestamps: true }
);

export default mongoose.model<ApprovalDocument>("Approval", ApprovalSchema);