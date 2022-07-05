import { Types } from "mongoose";

export interface Todo {
  title: string;
  isCompleted: boolean;
  _id: Types.ObjectId;
}

interface TodoListProps {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoListProps) => {
  return (
    <div>
      {todos.map((todo) => (
        <div
          className="border border-grey-400 p-4 rounded-md flex justify-between items-center"
          key={todo._id.toString()}
        >
          {todo.title}
          <input
            type="button"
            className="py-2 px-3 bg-green-400 text-white rounded-md cursor-pointer"
            value="DONE"
            onClick={() => (todo.isCompleted = true)}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList;
