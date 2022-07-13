import User from "./models/User";
import { Request, Response } from "express";
import Todo, {ITodo} from "./models/Todo";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";

const app = express();
dotenv.config({path: path.resolve(__dirname, '../.env')});

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI!
  : process.env.MONGODB_URI!

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/signup", (req: Request, res: Response) => {
  const newUser = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  newUser.save((err) => {
    if (err) {
      return res.status(400).json({
        title: "error",
        error: "Email already in use",
      });
    }
    return res.status(200).json({
      title: "user succesfully added",
    });
  });
});

app.post("/login", (req: Request, res: Response) => {
  User.findOne({ email: req.body.email }, (err: Error, user: any) => {
    console.log(user);
    if (err)
      return res.status(500).json({
        title: "server error",
        error: err.message,
      });
    if (!user) {
      return res.status(400).json({
        title: "user is not found",
        error: "invalid email or password",
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        title: "login failed",
        error: "invalid email or password",
      });
    }
    let token = jwt.sign({ userId: user._id }, "secretkey");
    return res.status(200).json({
      title: "login succesful",
      token: token,
    });
  });
});

app.get("/user", (req: Request, res: Response) => {
  let token = req.headers.token;
  if (typeof token === "string") {
    jwt.verify(token, "secretkey", (err: Error | null, decoded: any) => {
      if (err)
        return res.status(401).json({
          title: "not authorized",
        });
      User.findOne({ _id: decoded.userId }, (err: Error, user: any) => {
        if (err) return console.log(err);
        return res.status(200).json({
          title: "success",
          /* user: {
            username: user.username,
          }, */
        });
      });
    });
  }
});

app.get("/todo", (req: Request, res: Response) => {
  let token = req.headers.token;
  if (Array.isArray(token)) token = token[0];
  if (!token) {
    return res.status(401).json({
      title: "not authorized",
    });
  }
  jwt.verify(token, "secretkey", (err: Error | null, decoded: any) => {
    console.log("decoded: " + decoded);
    if (err)
      return res.status(401).json({
        title: "not authorized",
      });
    Todo.find({}, (err: Error, todos: ITodo[]) => {
      if (err) return console.log(err);
      return res.status(200).json({
        title: "success",
        todos: todos
      });
    });
  });
});
app.post("/todo", (req: Request, res: Response) => {
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
    let newTodo = new Todo({
      title: req.body.title,
      isCompleted: false,
      author: decoded.userID,
    });

    newTodo.save((saveErr) => {
      if (saveErr) return console.log(saveErr);
      return res.status(200).json({
        title: "successfully added",
        todo: newTodo,
      });
    });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, (err?: Error) => {
  if (err) return console.log(err);
  console.log("server running on port: ", port);
});

export default app;
