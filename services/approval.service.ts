import { FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import ApprovalModel, {ApprovalDocument, ApprovalInput} from "../models/approval.model";

export async function createApproval(input: ApprovalInput){
    return ApprovalModel.create(input);
}

export async function findApproval(
    query: FilterQuery<ApprovalDocument>,
    options: QueryOptions = { lean : false }){

    return ApprovalModel.findOne(query, {}, options);
}

export async function findAndUpdateApproval(
    query: FilterQuery<ApprovalDocument>,
    update: UpdateQuery<ApprovalDocument>,
    options: QueryOptions){

    return ApprovalModel.findOneAndUpdate(query, update, options);
}

export async function deleteApproval(
    query: FilterQuery<ApprovalDocument>){

    return ApprovalModel.deleteOne(query);
}