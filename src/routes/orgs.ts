import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser, IUserDoc } from "../models/User";
import mongoose, { Types } from "mongoose";
import Org, { IOrg, IOrgDoc } from "../models/Org";
import jwt from "jsonwebtoken";
import Todo, { ITodo } from "../models/Todo";

const router = Router();

router.post("/org", (req: Request, res: Response) => {
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

export default router;
