// Import required modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { api } from "./constants.js";

const app = express();
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

app.use(cors());

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
import orderRouter from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import { testEmail } from "./Controllers/test.js";

app.use(`${api}/users`, userRoutes);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/upload`, uploadRoutes);
app.use(`${api}/cart`, cartRoutes);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/payments`, paymentRoutes);
app.use(`${api}/payments`, paymentsRoutes);
app.get('/test-email', testEmail);
export { app };
