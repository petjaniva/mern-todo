import { Document, Schema, model, Types } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  todos: Types.ObjectId[];
  org?: Types.ObjectId;
  _id?: Types.ObjectId;
}

export interface IUserDoc extends IUser, Document<Types.ObjectId> {}

var validateEmail = function (email: string) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new Schema<IUser>({
  email: {
    unique: true,
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: String,
  todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  org: { type: Schema.Types.ObjectId, ref: "Org" },
});

const User = model<IUser>("User", userSchema);

export default User;
