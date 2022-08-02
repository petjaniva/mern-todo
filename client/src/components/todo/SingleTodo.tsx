import * as React from "react";
import { Todo } from "./TodoList";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { Types } from "mongoose";
import { IUser } from "../../../../src/models/User";

interface ITodoProps {
  todo: Todo;
  token: string;
}

const SingleTodo: React.FC<ITodoProps> = (props: ITodoProps) => {
  const token = props.token;

  const date = new Date(props.todo.date);
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  
    const onDoneClick = (todo: Todo) => {
      todo.isCompleted = !todo.isCompleted;
      axios.put(`/todo/${todo._id}`, todo, { headers: { token: token } });
    };
    const onDeleteClick = (todo: Todo) => {
      axios.delete(`/todo/${todo._id}`, { headers: { token: token } });
    };
    const getAuthorEmail = axios
      .get(`/user/:${props.todo.author}`, { headers: { token: token } })
      .then((res) => {
        return res.data.user.email;
      });
  
  return (
    <div
      className="border border-grey-400 p-4 rounded-md flex items-center justify-end"
      title={
        "date: " +
        date.toLocaleDateString("fi-FI", dateOptions) +
        "author: " +
        getAuthorEmail
      }
      key={props.todo._id!.toString()}
    >
      <div
        className={"mr-auto" + (props.todo.isCompleted ? "line-through" : "")}
      >
        {props.todo.title}{" "}
      </div>
      <input
        type="button"
        className="py-2 px-4 bg-green-400 text-white rounded-md cursor-pointer"
        value={props.todo.isCompleted ? "UNDONE" : "DONE"}
        onClick={() => onDoneClick(props.todo)}
      />
      <div className="px-2"></div>
      <AiFillDelete
        className="w-6 h-6 cursor-pointer"
        onClick={() => onDeleteClick(props.todo)}
      />
    </div>
  );
};

export default SingleTodo;
