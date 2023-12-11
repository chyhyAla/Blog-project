import { RequestHandler } from "express";

import createHttpError from "http-errors";

// In your Auth middleware
export const requireAuth: RequestHandler = (req, res, next) => {
  console.log("Headers:", req.headers);
  console.log("Session:", req.session);
  console.log("Cookies:", req.cookies);

  const user = req.cookies.userId;

  console.log("User:", user);

  if (req.session) {
    console.log("User is authenticated. UserId:", req.session);
    next();
  } else {
    console.log("User not authenticated");
    next(createHttpError(401, "User not authenticated"));
  }
};
