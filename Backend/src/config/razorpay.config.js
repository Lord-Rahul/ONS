import "dotenv/config"

export const RAZORPAY_CONFIG = {
  KEY_ID: process.env.RAZORPAY_KEY_ID,
  KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
};