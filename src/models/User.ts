import { Document, Schema, model } from "mongoose";


export interface IUser {
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    email: {
        unique: true,
        type: String
    },
    password: String
});

const User = model<IUser>('User', userSchema);

export default User;