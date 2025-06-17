import express from "express";
import dotenv from "dotenv";
dotenv.config();
import stkPushRouter from "./routes/stk.router.js";

const app = express();

app.use(express.json());

app.use("/stk-push", stkPushRouter);

export default app;