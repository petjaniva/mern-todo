import axios from "axios";
import React from "react";
import { IUser } from "../../../../src/models/User";
import { Todo } from "./TodoList";

interface TodoFormProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  user: IUser;
}

const TodoForm = ({ todos, setTodos, user }: TodoFormProps) => {
  const [title, setTitle] = React.useState("");
  const onSubmit = () => {
    const token = localStorage.getItem("token");
    const orgTodo = document.getElementById("org") as HTMLInputElement;
    if (title.length > 0 && token) {
      axios
        .post(
          "/todo",
          { title: title, org: orgTodo.checked },
          { headers: { token: token } }
        )
        .then((res) => {
          if (res.status === 200) {
            //let todo = res.data.todo;
            //setTodos([...todos, todo]);
            setTitle("");
          }
        });
    }
  };
  return (
    <div className="flex justify-between py-2">
      <input
        className="border w-full px-3 py-2 border-green-400 rounded-md"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label htmlFor="org" className="ml-1 text-green-400 ">
        Org
        <input type="checkbox" id="org" className="ml-2" />
      </label>

      <input
        type="button"
        className="py-2 px-3 bg-green-400 text-white rounded-md cursor-pointer"
        value="ADD"
        onClick={() => onSubmit()}
      />
    </div>
  );
};

export default TodoForm;
