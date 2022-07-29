import * as React from "react";
import { Todo } from "./TodoList";
import axios from "axios";

interface ITodoProps {
  todo: Todo;
}

const SingleTodo: React.FC<ITodoProps> = (props: ITodoProps) => {
  const onDoneClick = (todo: Todo) =>{
    const token = localStorage.getItem("token");
    if (token)
    {todo.isCompleted = !todo.isCompleted;
    axios.put(`/todo/${todo._id}`, todo, { headers: { token: token } });}
  }
    if (props.todo.isCompleted)
    {
        return (<div
            className="border border-grey-400 p-4 rounded-md flex justify-between items-center line-through"
            key={props.todo._id!.toString()}
          >
            {props.todo.title}
            <input
              type="button"
              className="py-2 px-3 bg-green-400 text-white rounded-md cursor-pointer"
              value="UNDONE"
              onClick={() => onDoneClick(props.todo)}
            />
          </div>)
    }
    else 
    {
        return (<div
            className="border border-grey-400 p-4 rounded-md flex justify-between items-center"
            key={props.todo._id!.toString()}
          >
            {props.todo.title}
            <input
              type="button"
              className="py-2 px-3 bg-green-400 text-white rounded-md cursor-pointer"
              value="DONE"
              onClick={() => onDoneClick(props.todo)}
            />
          </div>)
    }
}
export default SingleTodo;