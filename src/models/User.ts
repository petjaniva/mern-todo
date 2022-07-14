import { Document, Schema, model, Types } from "mongoose";




export interface IUser {
    email: string;
    password: string;
    todos: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    email: {
        unique: true,
        type: String
    },
    password: String,
    todos: [{type: Schema.Types.ObjectId,
            ref: 'Todo'}]
});

const User = model<IUser>('User', userSchema);

export default User;