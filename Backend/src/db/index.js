import 'dotenv/config'
import mongoose from "mongoose";
import { dbname } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/${dbname}`
    );
    console.log(
      `Database is connected sucessfully : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`database connection is failed : ${error}`);
    process.exit(1);
  }
};

export default connectDB;
