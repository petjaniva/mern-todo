import { Types } from "mongoose";
import * as React from "react";
import SingleTodo from "./SingleTodo";

export interface Todo {
  title: string;
  isCompleted: boolean;
  _id: Types.ObjectId;
  date: Date;
  author: Types.ObjectId;
}

interface TodoListProps {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoListProps) => {
  const token = localStorage.getItem("token");
  return (
    
    <div>
      {todos.map((todo) => (
        <SingleTodo key={todo._id!.toString()} todo={todo} token={(token ? token : "")} />
      ))}
    </div>
  );
};

export default TodoList;
