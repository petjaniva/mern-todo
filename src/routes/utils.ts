import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser, IUserDoc } from "../models/User";
import mongoose, { Types } from "mongoose";
import Org, { IOrg, IOrgDoc } from "../models/Org";
import jwt from "jsonwebtoken";
import Todo, { ITodo } from "../models/Todo";

const router = Router();

router.post("/reset", (req: Request, res: Response) => {
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
