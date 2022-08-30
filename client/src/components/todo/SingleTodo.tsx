import * as React from "react";
import { Todo } from "./TodoList";
import axios from "axios";
import {
  AiFillDelete,
  AiFillCheckCircle,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { IUser } from "../../../../src/models/User";

interface ITodoProps {
  todo: Todo;
  token: string;
  user: IUser;
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

  const onDoneClick = (clickedTodo: Todo) => {
    clickedTodo.isCompleted = !clickedTodo.isCompleted;
    //setTodo(clickedTodo);
    axios.put(`/todo/${clickedTodo._id}`, clickedTodo, {
      headers: { token: token },
    });
  };
  const onDeleteClick = (clickedTodo: Todo) => {
    axios.delete(`/todo/${clickedTodo._id}`, { headers: { token: token } });
    //props.setTodos(props.todos.filter((todo) => todo._id !== clickedTodo._id));
  };
  //function to update the todo when user starts working on it
  const onWorkingOnClick = (todo: Todo) => {
    todo.isWorkedOn = !todo.isWorkedOn;
    if (todo.isWorkedOn) {
      todo.workedOnBy = props.user.email;
      console.log(todo.workedOnBy);
    } else {
      todo.workedOnBy = null;
    }
    axios.put(`/todo/${todo._id}`, todo, { headers: { token: token } });
  };
  const titleString =
    "date: " +
    date.toLocaleDateString("fi-FI", dateOptions) +
    " author: " +
    props.todo.authorEmail +
    (props.todo.isWorkedOn ? " worked on by: " + props.todo.workedOnBy : "");

  return (
    <div
      className="border border-grey-400 p-4 rounded-md flex items-center justify-end"
      title={titleString}
      key={props.todo._id!.toString()}
    >
      <div
        className={props.todo.isCompleted ? "line-through mr-auto " : "mr-auto"}
      >
        {props.todo.title}{" "}
      </div>
      <input
        type="button"
        className={"py-2 px-4 bg-green-400  rounded-md cursor-pointer"}
        value={props.todo.isCompleted ? "UNDONE" : "DONE"}
        onClick={() => onDoneClick(props.todo)}
      />
      <div className="px-2" />
      {props.todo.isWorkedOn ? (
        <AiOutlineCheckCircle
          className="w-6 h-6 cursor-pointer"
          onClick={() => onWorkingOnClick(props.todo)}
        />
      ) : (
        <AiFillCheckCircle
          className="w-6 h-6 cursor-pointer"
          onClick={() => onWorkingOnClick(props.todo)}
        />
      )}
      <div className="px-2" />
      <AiFillDelete
        className="w-6 h-6 cursor-pointer"
        onClick={() => onDeleteClick(props.todo)}
      />
    </div>
  );
};

export default SingleTodo;
