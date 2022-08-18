import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import TodoForm from "../components/todo/TodoForm";
import TodoList, { Todo } from "../components/todo/TodoList";
import { IUser } from "../../../src/models/User";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [localToken, setLocaltoken] = React.useState<string>("");
  const [todoList, setTodoList] = React.useState<Todo[]>([]);
  const [orgTodoList, setOrgTodoList] = React.useState<Todo[]>([]);
  const [user, setUser] = React.useState<IUser>();
  const socket = io();

  React.useEffect(() => {
    setLocaltoken(localStorage.getItem("token")!);
  }, []);
  const getTodos = React.useCallback(() => {
    if (localToken) {
      axios
        .get("/todo", { headers: { token: localToken as string } })
        .then((res) => {
          if (res.status === 200) {
            setTodoList(res.data.todos);
            setOrgTodoList(res.data.orgTodos);
          }
        });
    }
  }, [localToken]);

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("update", getTodos);
  }, []);

  React.useEffect(() => {
    if (localToken) {
      axios
        .get("/user", { headers: { token: localToken } })
        .then((res) => {
          if (res.status === 200) {
            setUser(res.data.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [localToken]);

  React.useEffect(() => {
    if (localToken) {
      getTodos();
    }
  }, [localToken, getTodos]);

  return (
    <React.Profiler
      id="test1"
      onRender={(...args) => {
        console.log(args);
      }}
    >
      <>
        <Navbar />
        <div className="max-w-md mx-auto pt-12">
          <h1 className="font-bold text-green-400 text-center text-xl">
            my todos
          </h1>
          <TodoForm todos={todoList} setTodos={setTodoList} user={user!} />
          <TodoList key="ownTodos" todos={todoList} user={user!} />
          <h1 className="font-bold text-green-400 text-center text-xl">
            org todos
          </h1>
          <TodoList key="orgTodos" todos={orgTodoList} user={user!} />
        </div>
      </>
    </React.Profiler>
  );
};

export default Dashboard;
