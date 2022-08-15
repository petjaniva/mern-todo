import { Document, Schema, model, Types } from "mongoose";
import User from "./User";

export interface ITodo {
  title: string;
  isCompleted: boolean;
  author: Types.ObjectId;
  authorEmail: string;
  _id?: Types.ObjectId;
  date?: Date;
  org?: Types.ObjectId | null;
  isWorkedOn?: boolean;
  workedOnBy?: Types.ObjectId | null;
}

export const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
  },
  isCompleted: Boolean,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  authorEmail: String,
  date: Date,
  org: { type: Schema.Types.ObjectId, ref: "Org", default: null },
  isWorkedOn: { type: Boolean, default: false },
  workedOnBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

const Todo = model<ITodo>("Todo", todoSchema);

export default Todo;
