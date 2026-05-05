// Import required modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { api } from "./constants.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import logger from "./utils/logger.js";

const app = express();
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

// CORS Configuration - Validate origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key']
  })
);

app.use(cookieParser());

// Apply general rate limiter to all routes
app.use(generalLimiter);

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

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.statuscode || 500;
  const message = err.message || "Internal Server Error";

  // Log errors
  logger.error(`${req.method} ${req.path}`, {
    statusCode,
    message,
    userId: req.user?._id || 'anonymous',
    ip: req.ip
  });

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
import adminRoutes from "./routes/admin.routes.js";

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
app.use(`${api}/admin`, adminRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
});

export { app };
