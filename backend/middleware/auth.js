import User from "../model/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const auth = asyncHandler(async (req, res, next) => {
  let token = req.headers.token?.split(" ")[1];
  let decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decodedToken.id);
  if (!user) {
    throw new Error("User doesn't exist");
  }
  req.userId = user._id;
  next();
});

export const checkRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    //verify role on user
    if (!roles.includes(user.role)) {
      res.status(403);
      throw new Error("Permission denied!");
    }
    next();
  });
};

// module.exports = (func) => {
//     return (req, res, next) => {
//       func(req, res, next).catch((err) => next(err));
//     };
//   };
