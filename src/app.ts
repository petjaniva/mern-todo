import User, { IUser } from "./models/User";
import { Request, Response } from "express";
import Todo, { ITodo } from "./models/Todo";
import Org, { IOrg } from "./models/Org";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";

const app = express();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI!
    : process.env.MONGODB_URI!;

mongoose.connect(MONGODB_URI).then(()=> run().catch(console.dir));

let clients: Array<any> = [];

async function run() {
  const mongoClient = await mongoose.connection.getClient();
  const db = mongoClient.db();
  let changeStream;
  const collection = await db.collection("todos");
  changeStream = await collection.watch();
  changeStream.on("change", (next) => {{
    clients.forEach(client => client.res.write('update'))
    console.log("change", next);
  }});
} 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const eventsHandler = (req: Request, res: Response, next: any) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  console.log(newClient.id.toString());
  clients.push(newClient);
}

app.get("/events", eventsHandler);
app.post("/signup", (req: Request, res: Response) => {
  let userOrg: IOrg | null = null;
  if (req.body.orgCode) {
    Org.findOne({ code: req.body.orgCode }, (err: Error, foundOrg: IOrg) => {
      userOrg = foundOrg;
    });
  }
  const newUser = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    org: userOrg,
  });
  newUser.save((err) => {
    if (err) {
      return res.status(400).json({
        title: "error",
        error: "Email already in use",
      });
    }
    if (userOrg) {
      userOrg.members.push(newUser._id);
    }
    return res.status(200).json({
      title: "user succesfully added",
      user: newUser,
    });
  });
});

app.post("/org", (req: Request, res: Response) => {
  const newOrg = new Org({
    name: req.body.name,
    code: req.body.code,
    members: [],
  });
  newOrg.save((err) => {
    if (err) {
      return res.status(400).json({
        title: "error",
        error: err,
      });
    }
    return res.status(200).json({
      title: "organization succesfully added",
    });
  });
});

app.post("/login", (req: Request, res: Response) => {
  User.findOne({ email: req.body.email }, (err: Error, user: IUser) => {
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
      user: user,
      todos: user.todos,
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
          user: decoded,
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
    let orgTodos: ITodo[] = [];
    if (decoded.org) {
      decoded.org.todos.map((todoId: mongoose.Types.ObjectId) => {
        Todo.findOne({ _id: todoId }, (err: Error, todo: ITodo) => {
          orgTodos.push(todo);
        });
      });
    }
    if (err)
      return res.status(401).json({
        title: "not authorized",
      });
    Todo.find({ author: decoded.userId }, (err: Error, todos: ITodo[]) => {
      if (err) return console.log(err);
      return res.status(200).json({
        title: "success",
        todos: todos,
        orgTodos: orgTodos,
      });
    });
  });
});

app.put("/todo/:todoId", (req: Request, res: Response) => {
  try {
    let token = req.headers.token;
    if (Array.isArray(token)) token = token[0];
    if (!token) {
      return res.status(401).json({
        title: "not authorized",
      });
    }
    const updatedTodo = {
      title: req.body.title,
      author: req.body.author,
      isCompleted: req.body.isCompleted,
      _id: req.body._id,
      date: req.body.date,
      org: req.body.org,
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

app.post("/todo", (req: Request, res: Response) => {
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
    let newTodo = new Todo({
      title: req.body.title,
      isCompleted: false,
      author: decoded.userId,
      date: new Date(),
    });
    const savedTodo: ITodo = await newTodo.save();
    const user: IUser | null = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        title: "user not found",
      });
    }
    if (!req.body.org) {
      user.todos.concat(savedTodo._id!);
    } else {
      Org.findOne({ _id: decoded.org }, (err: Error, org: IOrg) => {
        if (err) {
          return res.status(404).json({
            title: "org not found",
          });
        }
        org.todos.concat(savedTodo._id!);
      });
    }
    return res.status(200).json({
      title: "successfully added",
      todo: newTodo,
    });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, (err?: Error) => {
  if (err) return console.log(err);
  console.log("server running on port: ", port);
});




export default app;
