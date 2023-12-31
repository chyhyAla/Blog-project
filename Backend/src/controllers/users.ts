import { RequestHandler } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const SignUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email } = req.body;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw (createHttpError(400), "Parameters missing");
    }

    const existingUsername = await userModel
      .findOne({ username: username })
      .exec();

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already taken. Please choose a different one or log in instead"
      );
    }

    const existingEmail = await userModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(
        409,
        "Email already exists. Please log in instead "
      );
    }
    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await userModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    req.session.email = newUser.email;
    req.session.userName = newUser.username;
    console.log(req.session);

    res.status(200).json(newUser);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}
export const Login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing!!");
    }

    const user = await userModel
      .findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    // Set the session cookie
    req.session.userName = user.username;
    req.session.userId = user._id;

    if (!req.session.userName) {
      console.error("UserId not set in session:", req.session);
      throw createHttpError(500, "UserId not set in session");
    }

    console.log("Authenticated User name from login:", req.session.userName);
    console.log("Authenticated UserID from login:", req.session.userId);
    console.log("Session after login:", req.session);

    // Save the session explicitly
    req.session.save();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const Logout: RequestHandler = async (req, res, next) => {
  console.log(req.session);
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
  console.log(req.session);
};
