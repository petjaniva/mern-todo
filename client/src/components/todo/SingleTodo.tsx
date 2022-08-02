import * as React from "react";
import { Todo } from "./TodoList";
import axios from "axios";
import {AiFillDelete} from "react-icons/ai";

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
  const onDeleteClick = (todo: Todo) =>{
    const token = localStorage.getItem("token");
    if (token)
    {axios.delete(`/todo/${todo._id}`, { headers: { token: token } });}
  }

        return (<div
            className="border border-grey-400 p-4 rounded-md flex items-center justify-end"
            key={props.todo._id!.toString()}
          >
            <div className={"mr-auto" + (props.todo.isCompleted ? 'line-through' : '')}>
            {props.todo.title}           </div>
            <input
              type="button"
              className="py-2 px-4 bg-green-400 text-white rounded-md cursor-pointer"
              value={(props.todo.isCompleted ? 'UNDONE' : 'DONE')}
              onClick={() => onDoneClick(props.todo)}
            />
            <div className="px-2"></div>
            <AiFillDelete className="w-6 h-6 cursor-pointer" onClick={() =>onDeleteClick(props.todo) }/>
          </div>)
    
}
export default SingleTodo;