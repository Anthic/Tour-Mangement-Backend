import express, { Request, Response } from "express";
import "../src/config/passport";
import cors from "cors";
import { router } from "./app/Routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandelers";
import notFoundPageHandler from "./app/middlewares/notFoundPageHandeler";
import passport from "passport";
import expressSession from "express-session";
const app = express();

app.use(
  expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
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
