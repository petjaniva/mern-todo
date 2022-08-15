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
  //function to update the todo when user starts working on it
  const onWorkingOnClick = (todo: Todo, user: IUser) => {
    todo.isWorkedOn = !todo.isWorkedOn;
    if (todo.isWorkedOn) {
      todo.workedOnBy = user._id;
    } else {
      todo.workedOnBy = null;
    }
    axios.put(`/todo/${todo._id}`, todo, { headers: { token: token } });
  };
  //function that returns users email as string if user is found from api
  // const getUserEmail = async (userId: Types.ObjectId): Promise<string> => {
  //   let user: IUser | undefined;
  //   let response = await axios.get(`/user/${userId}`, {
  //     headers: { token: token },
  //   });
  //   user = await response.data.user;
  //   if (user) {
  //     return user.email;
  //   }
  //   return "";
  // };
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
  // let userEmail;
  // getUserEmail(props.todo.author).then((result) => {
  //   console.log(result);
  //   userEmail = result;
  // });
  return (
    <div
      className="border border-grey-400 p-4 rounded-md flex items-center justify-end"
      title={
        "date: " +
        date.toLocaleDateString("fi-FI", dateOptions) +
        " author: " +
        props.todo.authorEmail
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
