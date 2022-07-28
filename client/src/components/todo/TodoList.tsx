import { Types } from "mongoose";
import * as React from "react";
import SingleTodo from "./SingleTodo";

export interface Todo {
  title: string;
  isCompleted: boolean;
  _id: Types.ObjectId;
}

interface TodoListProps {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoListProps) => {
  return (
    <div>
      {todos.map((todo) => (
        <SingleTodo todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
