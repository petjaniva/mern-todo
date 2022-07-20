import { Document, Schema, model, Types } from "mongoose";
import User from "./User";


export interface ITodo{
    title: string;
    isCompleted: boolean;
    author: Types.ObjectId;
    _id?: Types.ObjectId;
    date?: Date;
    org?: Types.ObjectId | null;
}

const todoSchema = new Schema<ITodo>({
    title: {
        unique: true,
        type: String
    },
    isCompleted: Boolean,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    org: {type: Schema.Types.ObjectId, ref: 'Org', default: null},
});

const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;