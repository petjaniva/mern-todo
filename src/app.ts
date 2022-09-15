import User, { IUser, IUserDoc } from "./models/User";
import { Request, Response } from "express";
import Todo, { ITodo } from "./models/Todo";
import Org, { IOrg, IOrgDoc } from "./models/Org";
const { createServer } = require("https");
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";
import * as io from "socket.io";
import Mongoose from "mongoose";

interface IToken {
  _id: Types.ObjectId;
  org: Types.ObjectId;
}

const app = express();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI!
    : process.env.MONGODB_URI!;

mongoose.connect(MONGODB_URI).then(() => run().catch(console.dir));
// mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const httpServer = createServer(app);

const ioServer = new io.Server(httpServer, {
  cors: {
    origin: "*",
  },
  transports: ["websocket", "polling"],
});

ioServer.on("connection", (socket) => {
  console.log("a user connected");
});

async function run() {
  const mongoClient = await mongoose.connection.getClient();
  const db = mongoClient.db();
  let changeStream;
  const collection = await db.collection("todos");
  changeStream = await collection.watch();
  changeStream.on("change", (next) => {
    ioServer.emit("update");
  });
}

app.post("/signup", (req: Request, res: Response) => {
  let userOrg;
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
    if (req.body.orgCode) {
      const promise = Org.findOne({ code: req.body.orgCode }).exec();
      promise
        .then((org) => {
          if (org) {
            userOrg = org;
            newUser.org = userOrg._id;
            newUser.save();
            userOrg.members.push(newUser._id);
            userOrg.save();
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
    todos: [],
  });
  newOrg.save((err) => {
    if (err) {
      console.log(err);
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

app.post("/reset", (req: Request, res: Response) => {
  User.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
  });
  Org.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
  });
  Todo.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
  });
  return res.status(200).json({
    title: "database succesfully reset",
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
    let token = jwt.sign({ _id: user._id, org: user.org }, "secretkey");
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
      User.findOne({ _id: decoded._id }, (err: Error, user: any) => {
        if (err) return console.log(err);
        return res.status(200).json({
          title: "user found",
          user: user,
        });
      });
    });
  }
});

//api to get spesific user by id
app.get("/user/:id", (req: Request, res: Response) => {
  let token = req.headers.token;
  if (typeof token === "string") {
    jwt.verify(token, "secretkey", (err: Error | null, decoded: any) => {
      if (err)
        return res.status(401).json({
          title: "not authorized",
        });
      User.findOne({ _id: req.params.id }, (err: Error, user: IUser) => {
        if (err) return console.log("Error in get user", req.params.id);
        return res.status(200).json({
          title: "success",
          user: user,
        });
      });
    });
  }
});

app.get("/todo", async (req: Request, res: Response) => {
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

//api to delete todos
app.delete("/todo/:id", (req: Request, res: Response) => {
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

app.put("/todo/:todoId", (req: Request, res: Response) => {
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

const port = process.env.PORT || 5000;

httpServer.listen(port, (err?: Error) => {
  if (err) return console.log(err);
  console.log("server running on port: ", port);
});

export default app;
