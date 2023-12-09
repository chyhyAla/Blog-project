import { RequestHandler } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Session } from "express-session";
declare module "express-session" {
  interface SessionData {
    userId?: mongoose.Types.ObjectId;
  }
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const authenticatedUserId = req.session.userId;
    console.log(authenticatedUserId);
    console.log(Session);
    console.log(req.session);

    if (!authenticatedUserId) {
      throw createHttpError(401, "User not authenticated");
    }

    const user = await userModel
      .findById(authenticatedUserId)
      .select("+email")
      .exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

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

    req.session.userId = newUser._id;

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
    req.session.userId = user._id;

    const authenticatedUserId = req.session.userId;

    if (!authenticatedUserId) {
      console.error("UserId not set in session:", req.session);
      throw createHttpError(500, "UserId not set in session");
    }

    console.log("Authenticated User ID from login:", authenticatedUserId);
    console.log("Session after login:", req.session);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const Logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
