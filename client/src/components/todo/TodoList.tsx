import { Types } from "mongoose";
import * as React from "react";
import { IUser } from "../../../../src/models/User";
import SingleTodo from "./SingleTodo";

export interface Todo {
  title: string;
  isCompleted: boolean;
  _id: Types.ObjectId;
  date: Date;
  author: Types.ObjectId;
  authorEmail: string;
  isWorkedOn?: boolean;
  workedOnBy?: Types.ObjectId | null;
}

interface TodoListProps {
  todos: Todo[];
  user: IUser;
}

const TodoList = ({ todos, user }: TodoListProps) => {
  const token = localStorage.getItem("token");
  return (
    <div>
      {todos.map((todo) => (
        <SingleTodo
          key={todo._id.toString()}
          todo={todo}
          token={token ? token : ""}
          user={user}
        />
      ))}
    </div>
  );
};

export default TodoList;
