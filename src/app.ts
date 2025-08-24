import express, { Request, Response } from "express";

import cors from "cors";
import { router } from "./app/Routes";

import { globalErrorHandler } from "./app/middlewares/globalErrorHandelers";
import notFoundPageHandler from "./app/middlewares/notFoundPageHandeler";

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Tour Management System ",
  });
});

app.use(globalErrorHandler);

app.use(notFoundPageHandler);
export default app;
