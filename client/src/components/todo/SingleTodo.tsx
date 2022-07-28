import * as React from "react";
import { Todo } from "./TodoList";

interface ITodoProps {
  todo: Todo;
}

const SingleTodo: React.FC<ITodoProps> = (props: ITodoProps) => {
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
              onClick={() => (props.todo.isCompleted = false)}
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
              onClick={() => (props.todo.isCompleted = true)}
            />
          </div>)
    }
}
export default SingleTodo;