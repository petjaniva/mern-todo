import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import TodoForm from "../components/todo/TodoForm";
import TodoList, { Todo } from "../components/todo/TodoList";
import { IUser } from "../../../src/models/User";
import { Socket, io } from "socket.io-client";

interface getTodosResponse {
  todos: Todo[];
  orgTodos: Todo[];
}
//const localToken = localStorage.getItem("token");
const api_url = "https://mern-todo-4b973.ew.r.appspot.com/";

const getTodos = (token: string): Promise<getTodosResponse> => {
  const promise = axios.get(api_url + "/todo", { headers: { token: token } });
  const object = promise.then((response) => {
    return { todos: response.data.todos, orgTodos: response.data.orgTodos };
  });
  return object;
};

const Dashboard = () => {
  const [localToken, setLocaltoken] = React.useState<string>("");
  const [todoList, setTodoList] = React.useState<Todo[]>([]);
  const [orgTodoList, setOrgTodoList] = React.useState<Todo[]>([]);
  const [user, setUser] = React.useState<IUser>();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    setSocket(io());
    if (localToken) {
      getTodos(localToken)
        .then((response) => {
          setTodoList(response.todos);
          setOrgTodoList(response.orgTodos);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [localToken]);

  React.useEffect(() => {
    setLocaltoken(localStorage.getItem("token")!);
  }, [localToken]);

  React.useEffect(() => {
    if (socket && localToken) {
      socket.on("connect", () => {
        console.log("connected");
      });
      socket.on("update", () => {
        console.log("update");
        getTodos(localToken).then((res) => {
          setTodoList(res.todos);
          setOrgTodoList(res.orgTodos);
        });
      });
    } else return;
  }, [socket, localToken]);

  //does localtoken have userid and could we use it here?
  React.useEffect(() => {
    if (localToken) {
      console.log("token found!");
      axios
        .get(api_url + "/user", { headers: { token: localToken } })
        .then((res) => {
          if (res.status === 200) {
            setUser(res.data.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else console.log("no token");
  }, [localToken]);

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto pt-12">
        <TodoForm todos={todoList} setTodos={setTodoList} user={user!} />
        <h1 className="font-bold text-green-400 text-center text-xl">
          my todos
        </h1>
        <TodoList key="ownTodos" todos={todoList} user={user!} />
        <h1 className="font-bold text-green-400 text-center text-xl">
          org todos
        </h1>
        <TodoList key="orgTodos" todos={orgTodoList} user={user!} />
      </div>
    </>
  );
};

export default Dashboard;
