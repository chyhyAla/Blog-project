import app from "./app";
import { connectDb } from "./DB/connection";
import envValidator from "./utils/validateEnv";
import express from "express";
import path from "path";

const port = envValidator.PORT;

const start = async () => {
  try {
    await connectDb(envValidator.MONGO_URI!);
    console.log("DB connected...");

    // Set NODE_ENV to 'production'
    process.env.NODE_ENV = "production";

    app.use(express.static("frontend/build"));
    app.use("/", express.static(path.join(__dirname, "public")));

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with an error code
  }
};

start();
