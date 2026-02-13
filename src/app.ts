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
  cors({
    origin: "http://localhost:5000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Tour Management System ",
    cookies: req.cookies,
  });
});

app.use(globalErrorHandler);

app.use(notFoundPageHandler);
export default app;
