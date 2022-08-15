import React, { useEffect, useState } from "react";
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

<<<<<<< HEAD
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

  //   React.useCallback(()  => {if (localToken) {
  //     axios.get("/todo", { headers: { token: localToken } }).then((res) => {
  //       console.log("event");
  //       if (res.status === 200) {
  //         setTodoList(res.data.todos);
  //         setOrgTodoList(res.data.orgTodos);
  //       }
  //     };
  //   } , [localToken]);
  // };

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

  // eventSource.addEventListener('update', eventGetTodos);

  React.useEffect(() => {
=======
  const getTodos = () => {
    console.log("getTodos");
>>>>>>> 910d41c41a243c977c46576bea8ba925367fb063
    if (localToken) {
      getTodos();
    }
<<<<<<< HEAD
  }, [localToken, getTodos]);
=======
  };

  //getTodos();
  // useEffect(() => {
  //   const source = new EventSource(`/events`);

  //   source.addEventListener("open", () => {
  //     console.log("SSE opened!");
  //   });

  //   source.addEventListener("message", (e) => {
  //     console.log("message");
  //   });

  //   source.addEventListener("error", (e) => {
  //     console.error("Error: ", e);
  //   });

  //   return () => {
  //     source.close();
  //   };
  // }, []);
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

  // setInterval(() => {
  //   getTodos();
  // }, 30000);

  // eventSource.addEventListener('update', eventGetTodos);

  if (localToken) {
    axios.get("/user", { headers: { token: localToken } }).then((res) => {
      setUser(res.data.user);
    });
  }

  // React.useEffect(() => {
  //   if (localToken) {
  //     axios.get("/todo", { headers: { token: localToken } }).then((res) => {
  //       if (res.status === 200) {
  //         setTodoList(res.data.todos);
  //         setOrgTodoList(res.data.orgTodos);
  //       }
  //     });
  //   }
  // }, [localToken]);
>>>>>>> 910d41c41a243c977c46576bea8ba925367fb063

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto pt-12">
        <h1 className="font-bold text-green-400 text-center text-xl">
          my todos
        </h1>
<<<<<<< HEAD
        <TodoForm todos={todoList} setTodos={setTodoList} user={user!} />
        <TodoList key="ownTodos" todos={todoList} user={user!} />
        <h1 className="font-bold text-green-400 text-center text-xl">
          org todos
        </h1>
=======
        <TodoForm todos={todoList} user={user!} setTodos={setTodoList} />
        <TodoList key="ownTodos" todos={todoList} user={user!} />
>>>>>>> 910d41c41a243c977c46576bea8ba925367fb063
        <TodoList key="orgTodos" todos={orgTodoList} user={user!} />
      </div>
    </>
  );
};

export default Dashboard;
