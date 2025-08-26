import crypto from "crypto";
import axios from "axios";
import { PHONEPE_CONFIG } from "../config/phonepe.config.js";
import { ApiError } from "./apiError.js";

export const generateXVerify = (payload, endpoint) => {
  const string = payload + endpoint + PHONEPE_CONFIG.SALT_KEY;

  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const xVerify = sha256 + "###" + PHONEPE_CONFIG.SALT_INDEX;

  return xVerify;
};

export const createPhonePePayment = async (orderData) => {
  try {
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: orderData.transactionId,
      merchantUserId: orderData.userId,
      amount: orderData.amount * 100,
      redirectUrl: PHONEPE_CONFIG.REDIRECT_URL,
      redirectMode: "REDIRECT",
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: orderData.mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const xVerify = generateXVerify(base64Payload, "/pg/v1/pay");

    if (!xVerify) {
      throw new Error("Failed to generate X-VERIFY header");
    }

    const response = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new ApiError(
      500,
      `payment initiation failed: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export const verifyPhonePePayment = async (transactionId) => {
  const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`;
  const xVerify = generateXVerify("", endpoint);

  try {
    const response = await axios.get(`${PHONEPE_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
      },
    });
    return response.data;
  } catch (error) {
    throw new ApiError(
      500,
      `PhonePe payment verification failed: ${error.message}`
    );
  }
};
