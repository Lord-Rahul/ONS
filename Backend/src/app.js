// Import required modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { api } from "./constants.js";

const app = express();
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  express.json({
    limit: "16kb",
  })
);

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

app.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use((err, req, res, next) => {
  const statusCode = err.statuscode || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const response = {
    success: false,
    statusCode,
    message,
  };

  if (process.env.NODE_ENV !== "production") {
    response.errors = err.errors || [];
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

import orderRouter from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";

// Health check endpoint
app.get(`${api}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: "ONS Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(`${api}/users`, userRoutes);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/upload`, uploadRoutes);
app.use(`${api}/cart`, cartRoutes);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/payments/phonepe`, paymentRoutes);
app.use(`${api}/payments/razorpay`, paymentsRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
});

export { app };
