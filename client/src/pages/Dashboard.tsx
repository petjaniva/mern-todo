import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import TodoForm from "../components/todo/TodoForm";
import TodoList, { Todo } from "../components/todo/TodoList";
import { IUser } from "../../../src/models/User";

const Dashboard = () => {
  const localToken = localStorage.getItem("token");
  const [todoList, setTodoList] = React.useState<Todo[]>([]);
  const [orgTodoList, setOrgTodoList] = React.useState<Todo[]>([]);
  const [user, setUser] = React.useState<IUser>();

  //   React.useEffect(() => {
  //     const eventSource = new EventSource("/events");
  //     eventSource.onmessage = () => {
  //       axios.get("/todo", { headers: { token: localToken as string } }).then((res) => {
  //         console.log("event");
  //         if (res.status === 200) {
  //          setTodoList(res.data.todos);
  //            setOrgTodoList(res.data.orgTodos);
  //     }
  //   })
  // }
  //   })

  const getTodos = () => {
    if (localToken) {
      axios.get("/todo", { headers: { token: localToken } }).then((res) => {
        console.log("event");
        if (res.status === 200) {
          setTodoList(res.data.todos);
          setOrgTodoList(res.data.orgTodos);
        }
      });
    }
  };

  // eventSource.addEventListener('update', eventGetTodos);

  React.useEffect(() => {
    if (localToken) {
      axios.get("/user", { headers: { token: localToken } }).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [localToken]);

  React.useEffect(() => {
    if (localToken) {
      axios.get("/todo", { headers: { token: localToken } }).then((res) => {
        if (res.status === 200) {
          setTodoList(res.data.todos);
          setOrgTodoList(res.data.orgTodos);
        }
      });
    }
  }, [localToken]);

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto pt-12">
        <h1 className="font-bold text-green-400 text-center text-xl">
          my todos
        </h1>
        <TodoForm todos={todoList} setTodos={setTodoList} user={user!} />
        <TodoList key="ownTodos" todos={todoList} user={user!} />
        <TodoList key="orgTodos" todos={orgTodoList} user={user!} />
      </div>
    </>
  );
};

export default Dashboard;
