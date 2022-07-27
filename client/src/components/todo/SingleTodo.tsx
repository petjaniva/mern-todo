import * as React from "react";
import {ITodo} from "../../../../src/models/Todo"

const SingleTodo = (todo : ITodo) => {
    if (todo.isCompleted)
    {
        return (<div
            className="border border-grey-400 p-4 rounded-md flex justify-between items-center line-through"
            key={todo._id!.toString()}
          >
            {todo.title}
            <input
              type="button"
              className="py-2 px-3 bg-green-400 text-white rounded-md cursor-pointer"
              value="DONE"
              onClick={() => (todo.isCompleted = false)}
            />
          </div>)
    }
    else 
    {
        return (<div
            className="border border-grey-400 p-4 rounded-md flex justify-between items-center"
            key={todo._id!.toString()}
          >
            {todo.title}
            <input
              type="button"
              className="py-2 px-3 bg-green-400 text-white rounded-md cursor-pointer"
              value="DONE"
              onClick={() => (todo.isCompleted = true)}
            />
          </div>)
    }
}
export default SingleTodo;