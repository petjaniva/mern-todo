import * as React from "react";
import { Todo } from "./TodoList";
import axios from "axios";
import { AiFillDelete, AiFillCheckCircle } from "react-icons/ai";
import { Types } from "mongoose";
import { IUser } from "../../../../src/models/User";

interface ITodoProps {
  todo: Todo;
  token: string;
  user: IUser;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const SingleTodo: React.FC<ITodoProps> = (props: ITodoProps) => {
  const token = props.token;
  const date = new Date(props.todo.date);
  const [todo, setTodo] = React.useState(props.todo);
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
    setTodo(clickedTodo);
    axios.put(`/todo/${todo._id}`, todo, { headers: { token: token } });
  };
  const onDeleteClick = (clickedTodo: Todo) => {
    axios.delete(`/todo/${clickedTodo._id}`, { headers: { token: token } });
    props.setTodos(props.todos.filter((todo) => todo._id !== clickedTodo._id));
  };
  //function to update the todo when user starts working on it
  const onWorkingOnClick = (clickedTodo: Todo, user: IUser) => {
    clickedTodo.isWorkedOn = !clickedTodo.isWorkedOn;
    if (clickedTodo.isWorkedOn) {
      clickedTodo.workedOnBy = user._id;
    } else {
      clickedTodo.workedOnBy = null;
    }
    setTodo(clickedTodo);
    axios.put(`/todo/${clickedTodo._id}`, clickedTodo, {
      headers: { token: token },
    });
  };
  //function that returns users email as string if user is found from api
  const getUserEmail = (userId: Types.ObjectId): string => {
    let user: IUser | undefined;
    axios
      .get(`/user/${userId}`, { headers: { token: token } })
      .then((res) => {
        user = res.data.user;
      })
      .catch((err) => {
        console.log(err);
      });
    if (user) {
      return user.email;
    }
    return "";
  };
  //   const getAuthorEmail = (authorId: Types.ObjectId): Promise<string> => {
  //     const promise = axios.get(`/user/${authorId}`, {
  //       headers: { token: token },
  //     })
  //       .then((res) => {
  //         if (res.status === 200) {
  //         const user: IUser = res.data;
  //         return user.email;
  //       }})
  //       return (promise.then((res) => { return res; }).catch((err) => { return err; }));
  // }
  return (
    <div
      className="border border-grey-400 p-4 rounded-md flex items-center justify-end"
      title={
        "date: " +
        date.toLocaleDateString("fi-FI", dateOptions) +
        " author: " +
        getUserEmail(props.todo.author)
      }
      key={props.todo._id!.toString()}
    >
      <div
        className={props.todo.isCompleted ? "line-through mr-auto" : "mr-auto"}
      >
        {props.todo.title}{" "}
      </div>
      <input
        type="button"
        className={
          (props.todo.isWorkedOn ? "text-blue-400" : "text-white") +
          "py-2 px-4 bg-green-400  rounded-md cursor-pointer"
        }
        value={props.todo.isCompleted ? "UNDONE" : "DONE"}
        onClick={() => onDoneClick(props.todo)}
      />
      <div className="px-2" />
      <AiFillCheckCircle
        className={
          (props.todo.isWorkedOn ? "to-blue-900" : "") +
          "w-6 h-6 cursor-pointer"
        }
        onClick={() => onWorkingOnClick(props.todo, props.user)}
      />
      <div className="px-2" />
      <AiFillDelete
        className="w-6 h-6 cursor-pointer"
        onClick={() => onDeleteClick(props.todo)}
      />
    </div>
  );
};

export default SingleTodo;
