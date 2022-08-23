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
const localToken = localStorage.getItem("token");

const getTodos = (token: string): Promise<getTodosResponse> => {
  console.log("getTodos token", token);
  const promise = axios.get("/todo", { headers: { token: token } });
  const object = promise.then((response) => {
    return { todos: response.data.todos, orgTodos: response.data.orgTodos };
  });
  return object;
};

const Dashboard = () => {
  // const [localToken, setLocaltoken] = React.useState<string>("");
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
  }, []);

  // React.useEffect(() => {
  //   setLocaltoken(localStorage.getItem("token")!);
  // }, []);

  //move this out of the Dashboard component and take lokaToken as a prop return object with two arrays of todos and orgTodos
  // const getTodos = React.useCallback(() => {
  //   if (localToken) {
  //     axios
  //       .get("/todo", { headers: { token: localToken as string } })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           setTodoList(res.data.todos);
  //           setOrgTodoList(res.data.orgTodos);
  //         }
  //       });
  //   }
  // }, []);

  //look more into websockets and react
  React.useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected");
      });
      socket.on("update", () => {
        console.log("update");
        if (localToken) {
          getTodos(localToken).then((res) => {
            setTodoList(res.todos);
            setOrgTodoList(res.orgTodos);
          });
        }
      });
    } else return;
  }, [socket]);

  //does localtoken have userid and could we use it here?
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
  }, []);

  return (
    <React.Profiler
      id="test1"
      onRender={(...args) => {
        //console.log(args);
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
