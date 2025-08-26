import crypto from "crypto";
import axios from "axios";
import { PHONEPE_CONFIG } from "../config/phonepe.config.js";

export const generateChecksum = (payload, endpoint) => {
  const bufferObj = Buffer.from(payload, "utf8");
  const base64EncodedPayload = bufferObj.toString("base64");
  const string = base64EncodedPayload + endpoint + PHONEPE_CONFIG.SALT_KEY;
  const sha256_val = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256_val + '###' + PHONEPE_CONFIG.SALT_INDEX;
  return { base64EncodedPayload, checksum };
};

export const createPhonePePayment = async (orderData) => {
  const endpoint = "/pg/v1/pay";
  
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
      type: "PAY_PAGE"
    }
  };

//   console.log("=== PhonePe Payment Request ===");
//   console.log("Payload:", JSON.stringify(payload, null, 2));

  const { base64EncodedPayload, checksum } = generateChecksum(JSON.stringify(payload), endpoint);

//   console.log("Base64 Payload:", base64EncodedPayload);
//   console.log("Checksum:", checksum);

  const options = {
    method: 'POST',
    url: `${PHONEPE_CONFIG.BASE_URL}${endpoint}`,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum
    },
    data: {
      request: base64EncodedPayload
    }
  };

  try {
    const response = await axios.request(options);
    // console.log("PhonePe Response:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    // console.error("PhonePe Error:", {
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   message: error.message
    // });
    throw new Error(`PhonePe payment failed: ${error.response?.data?.message || error.message}`);
  }
};

export const verifyPhonePePayment = async (transactionId) => {
  const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`;
  const { checksum } = generateChecksum("", endpoint);

  const options = {
    method: 'GET',
    url: `${PHONEPE_CONFIG.BASE_URL}${endpoint}`,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};