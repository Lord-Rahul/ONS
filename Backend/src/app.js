// Import required modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// Create an Express application
const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse JSON bodies with a size limit
app.use(
  express.json({
    limit: "16kb",
  })
);

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Parse URL-encoded bodies with a size limit
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

import userRoutes from "./routes/user.routes.js";

app.use(`/api/v1/users`, userRoutes);

// Export the Express app instance
export { app };
