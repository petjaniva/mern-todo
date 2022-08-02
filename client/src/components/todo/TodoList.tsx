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
  return (
    <div>
      {todos.map((todo) => (
        <SingleTodo key={todo._id!.toString()} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
