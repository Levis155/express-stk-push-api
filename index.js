import express from "express";
import stkRouter from "./routes/stk.routes.js";

const app = express();

app.use("/stk", stkRouter)

export default app;