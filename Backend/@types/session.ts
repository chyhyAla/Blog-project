import mongoose from "mongoose";
declare module "express-session" {
  interface SessionData {
    userId?: mongoose.Types.ObjectId;
    email: String;
    userName: String;
  }
}
