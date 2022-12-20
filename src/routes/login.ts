import { Router } from "express";
import { Request, Response } from "express";

import bcrypt from "bcrypt";
import User, { IUser, IUserDoc } from "../models/User";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/", (req: Request, res: Response) => {
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

export default router;
