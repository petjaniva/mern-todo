import { Document, Schema, model, Types } from "mongoose";
import { IUser } from "./User";
import { ITodo } from "./Todo";

export interface IOrg {
  name: string;
  code: string;
  members: Types.ObjectId[];
  todos: Types.ObjectId[];
  _id?: Types.ObjectId;
}

export interface IOrgDoc extends IOrg, Document<Types.ObjectId> {}

const orgSchema = new Schema<IOrg>({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
});

const Org = model<IOrg>("Org", orgSchema);

export default Org;
