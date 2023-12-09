import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import usersRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./utils/validateEnv";
import MongoStore from "connect-mongo";
import cors from "cors";
import { requireAuth } from "./middleware/Auth";

const app = express();

const corsOptions = {
  origin: ["https://notes-otv2.onrender.com", "http://localhost:3000"], // Add your frontend origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URI,
    }),
    // Ensure that credentials are sent with cross-origin requests
  })
);
// app.use("/", express.static(path.join(__dirname, "public")));

app.use("/api/users", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://notes-otv2.onrender.com");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api/notes", requireAuth, (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://notes-otv2.onrender.com");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// app.all("*", (req, res) => {
//   res.status(404);
//   if (req.accepts("html")) {
//     res.sendFile(path.join(__dirname, "views", "404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ message: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 Not Found");
//   }
// });

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
