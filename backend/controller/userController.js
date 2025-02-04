import User from "../model/User.js";
import generateToken from "../utils/generateToken.js";
import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";
import send from "../utils/send.js";

export const register = expressAsyncHandler(async (req, res, next) => {
  let { username, email, password, confirmPassword } = req.body;
  console.log(req.file);

  //verify user is in db already
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists,Please Login");
  }
  //creating a new user
  let newUser = await User.create({
    username,
    email,
    role: req.body?.role || "user",
    password,
    confirmPassword,
    photo: req.file?.path,
  });
  //generate token
  let token = await generateToken(newUser._id);
  //sending response
  res.status(201).json({ newUser, token });
});

export const login = expressAsyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  //verify user is in db already
  let existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("User doesnt exist,Please Register");
  }
  //verify password
  let result = await existingUser.verifyPassword(
    password,
    existingUser.password
  );
  if (!result) {
    throw new Error("Password is not correct");
  }
  //token
  let token = await generateToken(existingUser._id);
  //sending response
  res.status(201).json({ existingUser, token });
});

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
  let { id } = req.params;
  await User.findByIdAndUpdate(id, { photo: req.file?.path }, { new: true });
  res.sendStatus(201);
});

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (token === null || password === null || confirmPassword === null) {
    throw new Error("resetToken or Password is missing");
  }

  const exisitingUser = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiresAt: { $gt: Date.now() }
  });

  if (!exisitingUser) {
    throw new Error("Invalid or token expiration");
  }

  existingUser.password = password;
  existingUser.confirmPassword = confirmPassword;
  existingUser.resetPasswordToken = undefined;
  existingUser.resetPasswordTokenExpiresAt = undefined;

  await exisitingUser.save({ validateBeforeSave: false });

  res.status(200).send("password reset successfull");
});

export const forgotPassword = expressAsyncHandler(async (req, res, next) => {
  let { email } = req.params;

  let exisitingUser = await User.findOne(email);
  if (!exisitingUser) {
    throw new Error("User dosen't exhists");
  }

  let resetPasswordToken = crypto.randomBytes(16).toString('hex');
  let resetPasswordTokenExpiresAt = new Date() + 60 * 60 * 1000;

  exisitingUser.resetPasswordToken = resetPasswordToken;
  exisitingUser.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;

  // we are saving the new values for the exhisting user , but not validating all the values
  // as confirm password is required

  await exisitingUser.save({ validateBeforeSave: false });

  let resetPasswordLink = `${req.protocol}://${req.hostname}:5001/api/user/reset-password/${resetPasswordToken}`;
  let options = {
    subject: "Reset your password",
    to: exisitingUser.email,
    text: `This is the reset password link, this expires in 1 hour ${resetPasswordLink} click here to reset the password`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
        }
        .content {
            margin: 20px 0;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777777;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>We received a request to reset your password. Click the button below to reset it.</p>
            <a href="${resetPasswordLink}" class="button">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
  };
  await send(options);
  res.status(200).json("Reset password link sent");
});
