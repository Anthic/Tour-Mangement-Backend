/* eslint-disable no-console */
import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";

import { configEnv } from "./config/env";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(configEnv.MONGO_URL);
    console.log("Connected to MongoDB successfully");

    server = app.listen(configEnv.PORT, () => {
      console.log("server is running on port 3000");
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

startServer();

//error handling for graceful shutdown
// Handle graceful shutdown Signals error from server aws/docker etc
process.on("SIGTERM", (error) => {
  console.log("SIGTERM Rejection, shutting down server", error);
  if (server) {
    server.close(() => {
      console.log("Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
// Handle graceful shutdown unhandled rejections
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection, shutting down server", error);
  if (server) {
    server.close(() => {
      console.log("Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
//Promise.reject(new Error("I forgot to catch this error!"));

// Handle graceful shutdown uncaught exceptions
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception, shutting down server!", error);
  if (server) {
    server.close(() => {
      console.log("Server closed due to uncaught exception");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
//throw new Error("I forgot to catch this error!");
