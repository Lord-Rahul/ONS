import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import logger from "./utils/logger.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || "8080", () => {
      const port = process.env.PORT || "8080";
      const message = `app is running at http://localhost:${port}`;
      console.log(message);
      logger.info(message);
    });
  })
  .catch((err) => {
    const errorMsg = `MongoDB connection failed: ${err?.message || err}`;
    console.error(errorMsg);
    logger.error(errorMsg, { error: err?.stack });
    process.exit(1);
  });
