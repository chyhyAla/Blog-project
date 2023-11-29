import mongoose from "mongoose";
import { SessionData } from "express-session";

declare module "express session" {
  interface SessionData {
    userId: mongoose.Types.ObjectId;
  }
}
