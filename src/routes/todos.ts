import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser, IUserDoc } from "../models/User";
import mongoose, { Types } from "mongoose";
import Org, { IOrg, IOrgDoc } from "../models/Org";
import jwt from "jsonwebtoken";
import Todo, { ITodo } from "../models/Todo";

const router = Router();

router.get("/todo", async (req: Request, res: Response) => {
  let token = req.headers.token;
  if (Array.isArray(token)) token = token[0];
  if (!token) {
    return res.status(401).json({
      title: "not authorized",
    });
  }
  jwt.verify(token, "secretkey", async (err: Error | null, decoded: any) => {
    if (err)
      return res.status(401).json({
        title: "not authorized",
      });
    type ID = Types.ObjectId;
    type Populated<M, K extends keyof M> = Omit<M, K> & {
      [P in K]: Exclude<M[P], ID[] | ID>;
    };
    const user = (await User.findById(decoded._id)
      .populate("todos")
      .exec()) as Populated<IUserDoc, "todos">;
    let todos = user.todos;
    let orgTodos: ITodo[] = [];
    if (user.org) {
      const org = (await Org.findById(user.org)
        .populate("todos")
        .exec()) as Populated<IOrgDoc, "todos">;
      orgTodos = org.todos;
    }
    return res.status(200).json({
      title: "success",
      todos: todos,
      orgTodos: orgTodos,
    });
  });
});

router.delete("/todo/:id", (req: Request, res: Response) => {
  let token = req.headers.token;
  if (Array.isArray(token)) token = token[0];
  if (!token) {
    return res.status(401).json({
      title: "not authorized",
    });
  }
  jwt.verify(token, "secretkey", (err: Error | null, decoded: any) => {
    if (err)
      return res.status(401).json({
        title: "not authorized",
      });
    Todo.findOneAndDelete({ _id: req.params.id }, (err: Error) => {
      if (err) return console.log(err);
      return res.status(200).json({
        title: "success",
      });
    });
  });
});

router.put("/todo/:todoId", (req: Request, res: Response) => {
  try {
    let token = req.headers.token;
    if (Array.isArray(token)) token = token[0];
    if (!token) {
      return res.status(401).json({
        title: "not authorized",
      });
    }
    const updatedTodo: ITodo = {
      title: req.body.title,
      author: req.body.author,
      authorEmail: req.body.authorEmail,
      isCompleted: req.body.isCompleted,
      _id: req.body._id,
      date: req.body.date,
      org: req.body.org,
      isWorkedOn: req.body.isWorkedOn,
      workedOnBy: req.body.workedOnBy,
    };
    jwt.verify(token, "secretkey", async (err: Error | null, decoded: any) => {
      if (err) {
        return res.status(401).json({
          title: "not authorized",
        });
      }
      Todo.findByIdAndUpdate(req.params.todoId, updatedTodo, (err: Error) => {
        if (err) return res.status(400);
      });
      return res.status(200).json({
        title: "successfully updated",
        todo: updatedTodo,
      });
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/todo", (req: Request, res: Response) => {
  let token = req.headers.token;
  if (Array.isArray(token)) token = token[0];
  if (!token) {
    return res.status(401).json({
      title: "not authorized",
    });
  }
  jwt.verify(token, "secretkey", async (err: Error | null, decoded: any) => {
    if (err)
      return res.status(401).json({
        title: "not authorized",
      });
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        title: "user not found",
      });
    }
    let org;
    if (req.body.org) {
      org = await Org.findById(user.org);
    }
    let newTodo = new Todo({
      title: req.body.title,
      isCompleted: false,
      author: decoded._id,
      authorEmail: user.email,
      date: new Date(),
      org: org ? org._id : null,
    });
    const savedTodo = await newTodo.save();
    if (!req.body.org || !org) {
      user.todos.push(savedTodo._id!);
      user.save();
    } else {
      org.todos.push(savedTodo._id!);
      org.save();
    }
    return res.status(200).json({
      title: "successfully added",
      todo: newTodo,
    });
  });
});

export default router;
