import User, { IUser } from "../src/models/User";
import app from "../src/app";
import request from "supertest";
import Todo, { ITodo } from "../src/models/Todo";
import Org, { IOrg } from "../src/models/Org";
import { Schema, model, Types } from "mongoose";

let userId: Types.ObjectId;
let token: object;
const newUser: IUser = {
  email: "tester@gmail.com",
  password: "passu",
  todos: [],
};
const newOrg: IOrg = {
  name: "test org",
  code: "dupdup",
  members: [],
  todos: [],
};
const orgUser: IUser = {
  email: "tester@org.com",
  password: "passupassu",
  todos: [],
}
const testTodo: ITodo = {
  title: "test todo",
  isCompleted: false,
  author: userId,
};
const anotherTodo: ITodo = {
  title: "test2 todo",
  isCompleted: false,
  author: userId,
};
beforeAll(async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
  await Org.deleteMany({});
});

describe("user-tests", () => {
  it("creating user", async () => {
    await request(app).post("/signup").send(newUser).expect(200);
  });
  it("only one user", () => {
    User.find({}, function (err: Error, person: IUser[]) {
      if (err) console.log(err);
      expect(person.length).toEqual(1);
    });
  });

  describe("login tests", () => {
    it("logging in works", async () => {
      const response = await request(app)
        .post("/login")
        .send(newUser)
        .expect(200);
      token = { token: `${response.body.token}` };
      userId = response.body.user._id;
      expect(userId).toBeDefined();
    });
    it("logging in with bad credentials", async () => {
      await request(app)
        .post("/login")
        .send({ email: "keksi", password: "pulla" })
        .expect(400);
    });
    it("logging in with bad password", async () => {
      await request(app)
        .post("/login")
        .send({ email: "tester@gmail.com", password: "promppu" })
        .expect(401);
    });
  });
  describe("todo tests", () => {
  
    it("posting a todo works", async () => {
      await request(app).post("/todo").send(testTodo).set(token).expect(200);
    });
    it("getting todos works", async () => {
      const response = await request(app).get("/todo").set(token).expect(200);
      expect(response.body.todos.length).toBe(1);
    });
    it("getting 2 todos when there are 2 todos", async () => {
      await request(app).post("/todo").send(anotherTodo).set(token).expect(200);

      const response = await request(app).get("/todo").set(token).expect(200);
      expect(response.body.todos.length).toBe(2);
    });
    it("todo has correct author", async () => {
      const response = await request(app).get("/todo").set(token).expect(200);
      expect(response.body.todos[0].author).toBe(userId);
    });
    it("todo has date", async () => {
      const response = await request(app).get("/todo").set(token).expect(200);
      expect(response.body.todos[0].date).toBeDefined();
    });
  });
  describe("org tests", () => {
    it("create a org", async () => {
      await request(app).post("/org").send(newOrg).expect(200);
    });
    it("create a user that belongs to a org", async () => {
      const response = await request(app).post("/signup").send(orgUser).send({orgCode: "dupdup"}).expect(200);
      expect(response.body.user.org).toBeDefined();
    });
    it("create an org todo", async () => {
      const response = await request(app).post("/login").send(orgUser).expect(200);
      const orgUserToken = {token : response.body.token};
      const todoREsponse = await request(app).post("/todo").set(orgUserToken).send(anotherTodo).send(response.body.user.org).expect(200);
    })
  });

});
