import dotenv from 'dotenv';
dotenv.config();

export const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
  SALT_KEY: process.env.PHONEPE_SALT_KEY,
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || "1",
  BASE_URL: process.env.PHONEPE_BASE_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox",
  REDIRECT_URL: process.env.PHONEPE_REDIRECT_URL || "http://localhost:3000/payment/success",
  CALLBACK_URL: process.env.PHONEPE_CALLBACK_URL || "http://localhost:8000/api/v1/payments/callback",
};