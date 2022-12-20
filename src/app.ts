const { createServer } = require("http");
import express from "express";
import cors from "cors";

import mongoose, { Types } from "mongoose";

import * as dotenv from "dotenv";
import * as path from "path";
import * as io from "socket.io";

import userRouter from "./routes/users";
import orgRouter from "./routes/orgs";
import todoRouter from "./routes/todos";
import utilsRouter from "./routes/utils";
import loginRouter from "./routes/login";
import signupRouter from "./routes/signup";

const app = express();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI!
    : process.env.MONGODB_URI!;

mongoose.connect(MONGODB_URI).then(() => run().catch(console.dir));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const httpServer = createServer(app);

const ioServer = new io.Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
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

const port = process.env.PORT || 5000;

httpServer.listen(port, (err?: Error) => {
  if (err) return console.log(err);
  console.log("server running on port: ", port);
});

app.use("/user", userRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/org", orgRouter);
app.use("/todo", todoRouter);
app.use("/reset", utilsRouter);

export default app;
