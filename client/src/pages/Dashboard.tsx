import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import TodoForm from "../components/todo/TodoForm";
import TodoList, { Todo } from "../components/todo/TodoList";

const Dashboard = () => {
  const localToken = localStorage.getItem("token");
  const [todoList, setTodoList] = React.useState<Todo[]>([]);

  React.useEffect(() => {
    if (localToken) {
      axios
        .get("/user", { headers: { token: localToken } })
        .then((res) => console.log(res));
    }
  }, [localToken]);

  React.useEffect(() => {
    if (localToken) {
      axios.get("/todos", { headers: { token: localToken } }).then((res) => {
        if (res.status === 200) {
          setTodoList(res.data.todos);
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
        <TodoForm todos={todoList} setTodos={setTodoList} />
        <TodoList todos={todoList}/>
      </div>
    </>
  );
};
export default Dashboard;
