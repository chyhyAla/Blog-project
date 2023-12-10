import { RequestHandler } from "express";

import createHttpError from "http-errors";

// In your Auth middleware
export const requireAuth: RequestHandler = (req, res, next) => {
  console.log("Session:", req.session);
  console.log("Cookies:", req.cookies);

  const user = req.session.userId;

  console.log("User:", user);

  if (user) {
    console.log("User is authenticated. UserId:", req.session.userId);
    next();
  } else {
    console.log("User not authenticated");
    next(createHttpError(401, "User not authenticated"));
  }
};
