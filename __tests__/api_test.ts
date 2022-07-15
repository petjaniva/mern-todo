import User, {IUser} from "../src/models/User";
import app from "../src/app";
import request from "supertest";
import Todo, {ITodo} from "../src/models/Todo"
import {Schema, model, Types } from "mongoose";

let userId: Types.ObjectId;
let token: object;
const newUser: IUser = {
  email: "tester@gmail.com",
  password: "passu",
  todos: []
};


beforeAll(async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
});

describe("user-tests", () => {
  it("creating user", async () => {
    await request(app)
      .post("/signup")
      .send(newUser)
      .expect(200);
  });
  it("only one user", () => {
    User.find({}, function (err: Error, person: IUser[]){
      if (err) console.log(err);
      expect(person.length).toEqual(1);
    })
  })
  describe("login tests", () => {
    it("logging in works", async () => {
      const response = await request(app)
        .post("/login")
        .send(newUser)
        .expect(200);
      token = {'token': `${response.body.token}`};
      userId = response.body.userId;
    });
    it("logging in with bad credentials", async () => {
      await request(app)
        .post("/login")
        .send({email: 'keksi',
              password: 'pulla'})
        .expect(400);
    });
    it("logging in with bad password", async () => {
      await request(app)
        .post("/login")
        .send({email: 'tester@gmail.com',
              password: 'promppu'})
        .expect(401);
    });
  })
  describe("todo tests",  () => {
     
    const testTodo: ITodo = {
      title: "test todo",
      isCompleted: false,
      author: userId,
    };
    const anotherTodo: ITodo = {
      title: "test2 todo",
      isCompleted: false,
      author: userId
    };
    it("posting a todo works", async () => {
      await request(app)
        .post("/todo")
        .send(testTodo)
        .set(token)
        .expect(200);
    })
    it("getting todos works", async () => {
      const response = await request(app)
      .get("/todo")
      .set(token)
      .expect(200);
      expect(response.body.todos.length).toBe(1);
    })
    it("getting 2 todos when there are 2 todos", async () => {
      await request(app)
        .post("/todo")
        .send(anotherTodo)
        .set(token)
        .expect(200);
      
      const response = await request(app)
      .get("/todo")
      .set(token)
      .expect(200);
      expect(response.body.todos.length).toBe(2);
    })
    it("todo has correct author", async () => {
      const response = await request(app)
      .get("/todo")
      .set(token)
      .expect(200);
      expect(response.body.todos[0].author).toBe(userId);
    })
  })
});
