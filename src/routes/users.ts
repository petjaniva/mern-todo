import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser, IUserDoc } from "../models/User";
import mongoose, { Types } from "mongoose";
import Org, { IOrg, IOrgDoc } from "../models/Org";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", (req: Request, res: Response) => {
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

router.get("/:id", (req: Request, res: Response) => {
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
