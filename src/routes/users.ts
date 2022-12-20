import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser, IUserDoc } from "../models/User";
import mongoose, { Types } from "mongoose";
import Org, { IOrg, IOrgDoc } from "../models/Org";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/signup", (req: Request, res: Response) => {
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

router.post("/login", (req: Request, res: Response) => {
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

router.get("/user", (req: Request, res: Response) => {
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

router.get("/user/:id", (req: Request, res: Response) => {
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

export default router;
