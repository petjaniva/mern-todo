import { Router } from "express";
import { Request, Response } from "express";

import bcrypt from "bcrypt";
import User from "../models/User";
import Org from "../models/Org";

const router = Router();

router.post("/", (req: Request, res: Response) => {
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

export default router;
