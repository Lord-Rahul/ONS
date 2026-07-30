import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

let transporterInstance = null;

const getTransporter = () => {
  if (transporterInstance) return transporterInstance;

  const port = Number(process.env.EMAIL_PORT) || 587;
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporterInstance;
};

export const getFromAddress = () => {
  const name = process.env.EMAIL_FROM_NAME || "ONS Store";
  const address = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || "noreply@onsstore.com";
  return `"${name}" <${address}>`;
};

const sendEmail = async (mailOptions) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    logger.warn("Email credentials (EMAIL_USER/EMAIL_PASSWORD) are missing in .env. Skipping email dispatch.");
    return null;
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromAddress(),
      ...mailOptions
    });
    logger.info(`Email sent successfully to ${mailOptions.to} (MessageId: ${info.messageId})`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${mailOptions.to}: ${error?.message || error}`, { error: error?.stack });
    return null;
  }
};

export const sendOrderConfirmationEmail = async (order) => {
  const itemsList = order.items
    .map(
      (item) => ` <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.productSnapshot.name}</strong><br>
        Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${item.itemSubtotal.toLocaleString()}
      </td>
    </tr>`
    )
    .join("");

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total { background: #4CAF50; color: white; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! 🎉</h1>
          <p>Thank you for shopping with ONS Store</p>
        </div>
        
        <div class="content">
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${
              order.paymentDetails.method
            }</p>
            
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address1}<br>
              ${
                order.shippingAddress.address2
                  ? order.shippingAddress.address2 + "<br>"
                  : ""
              }
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${
    order.shippingAddress.pincode
  }<br>
              Phone: ${order.shippingAddress.phone}
            </p>
            
            <h3>Items Ordered</h3>
            <table class="items-table">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">Items Subtotal</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${order.itemsSubtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">Shipping Charges</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${order.shippingCharges.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">Tax Amount</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${order.taxAmount.toLocaleString()}</td>
                </tr>
                <tr class="total">
                  <td style="padding: 15px; font-weight: bold;">Total Amount</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold;">₹${order.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="footer">
          <p>You can track your order status in your account dashboard.</p>
          <p>Thank you for choosing ONS Store!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: order.shippingAddress.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: emailHTML,
  };
  return await sendEmail(mailOptions);
};


export const sendPaymentSuccessEmail = async (order) => {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .success-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Successful! ✅</h1>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h2>Your payment has been processed successfully</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Amount Paid:</strong> ₹${order.totalAmount.toLocaleString()}</p>
            <p><strong>Payment Date:</strong> ${new Date(order.paymentDetails.paidAt).toLocaleString()}</p>
            <p><strong>Transaction ID:</strong> ${order.paymentDetails.gatewayPaymentId}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Your order is now being processed and will be shipped soon.</p>
          <p>Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: order.shippingAddress.email,
    subject: `Payment Successful - ${order.orderNumber}`,
    html: emailHTML
  };

  return await sendEmail(mailOptions);
};


export const sendOrderStatusEmail = async (order, newStatus) => {
  const statusMessages = {
    confirmed: "Your order has been confirmed and is being prepared.",
    processing: "Your order is being processed in our warehouse.",
    shipped: "Great news! Your order has been shipped and is on its way.",
    out_for_delivery: "Your order is out for delivery and will reach you soon.",
    delivered: "Your order has been delivered successfully. Thank you!",
    cancelled: "Your order has been cancelled as requested.",
    returned: "Your return request has been processed.",
    refunded: "Your refund has been processed and will reflect in your account soon."
  };

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .status-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
        </div>
        
        <div class="content">
          <div class="status-box">
            <h2>Order ${order.orderNumber}</h2>
            <p><strong>Status:</strong> ${newStatus.toUpperCase()}</p>
            <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
            <p><strong>Updated on:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Track your order anytime in your account dashboard.</p>
          <p>Thank you for choosing ONS Store!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: order.shippingAddress.email,
    subject: `Order ${newStatus.replace('_', ' ').toUpperCase()} - ${order.orderNumber}`,
    html: emailHTML
  };

  return await sendEmail(mailOptions);
};

export const sendWelcomeEmail = async (user) => {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .welcome-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ONS Store! 🎉</h1>
        </div>
        
        <div class="content">
          <div class="welcome-box">
            <h2>Hi ${user.fullName}!</h2>
            <p>Thank you for joining ONS Store. We're excited to have you as part of our community!</p>
            <p>Explore our amazing collection of clothing and enjoy shopping with us.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Happy Shopping!</p>
          <p>The ONS Store Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: user.email,
    subject: 'Welcome to ONS Store!',
    html: emailHTML
  };

  return await sendEmail(mailOptions);
};
