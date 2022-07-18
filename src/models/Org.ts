import { Document, Schema, model, Types } from "mongoose";
import { IUser } from "./User";

export interface IOrg {
  name: string;
  code: string;
  members: IUser[];
};

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
});

const Org = model<IOrg>("Org", orgSchema);

export default Org;
