import { RequestHandler } from "express";
import createHttpError from "http-errors";

// In your Auth middleware
export const requireAuth: RequestHandler = (req, res, next) => {
  const user = req.session.userId;
  if (user) {
    console.log("User is authenticated. UserId:", req.session.userId);
    next();
  } else {
    console.log("User not authenticated");
    next(createHttpError(401, "User not authenticated"));
  }
};
