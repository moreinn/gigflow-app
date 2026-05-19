import dotenv from "dotenv";

dotenv.config();

import express from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";

import leadRoutes from "./routes/lead.routes";

const app = express();

app.use(
  cors({
    origin: "https://gig-flow-smart-leads-dashboard-olive.vercel.app",
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

if (
  process.env.NODE_ENV ===
  "development"
) {
  app.use(morgan("dev"));
}

app.get("/", (_, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

export default app;