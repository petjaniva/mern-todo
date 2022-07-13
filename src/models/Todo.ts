import { Document, Schema, model, Types } from "mongoose";
import User from "./User";


export interface ITodo {
    title: string;
    isCompleted: boolean;
    author?: Types.ObjectId,
}

const todoSchema = new Schema<ITodo>({
    title: {
        unique: true,
        type: String
    },
    isCompleted: Boolean,
    author: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;