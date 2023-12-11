import mongoose from "mongoose";
declare module "express-session" {
  interface SessionData {
    email: String;
    userName: String;
  }
}
