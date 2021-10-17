import { FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import UserModel, {UserDocument, UserInput} from "../models/user.model";

export async function createUser(input: UserInput){
    return UserModel.create(input);
}

export async function findUser(
    query: FilterQuery<UserDocument>){

    return UserModel.findOne({query});
}

export async function findAndUpdateUser(
    query: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
    options: QueryOptions){

    return UserModel.findOneAndUpdate(query, update, options);
}

export async function deleteUser(
    query: FilterQuery<UserDocument>){

    return UserModel.deleteOne(query);
}