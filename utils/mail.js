import { createTransport } from "nodemailer";

export const mailTransporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_GMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

export const generateMailCode = () => Math.floor(100000 + Math.random() * 900000).toString();
export const generateMailCodeExpires = () => Date.now() + 60 * 60 * 1000; // 1 hour

const htmlContent = {
  welcomeAndVerify: (name, code) => `
    <div style="text-align: center;">
      <h2>Welcome to Drelo Routes, ${name}!</h2>
      <p>Use this code to activate your account:</p>
      <p style="font-size: 1.5rem; font-weight: bold;">${code}</p>
      <p>This code expires in 1 hour.</p>
    </div>
  `,
  resetPassword: (name, code) => `
    <div style="text-align: center;">
      <h2>Hello, ${name}!</h2>
      <p>Use this code to reset your password:</p>
      <p style="font-size: 1.5rem; font-weight: bold;">${code}</p>
      <p>This code expires in 1 hour.</p>
    </div>
  `,
};

import { mailTransporter } from "./transporter.js"; // or however it's set up
import { generateMailCode, generateMailCodeExpires } from "./helpers.js"; // if you have them split

export const sendMail = async (user, subject, type) => {
  const code = generateMailCode(); // 🔐 generate a new code
  const expires = generateMailCodeExpires(); // ⏰

  const html =
    type === "verify"
      ? htmlContent.welcomeAndVerify(user.name, code)
      : htmlContent.resetPassword(user.name, code);

  const mailOptions = {
    from: process.env.USER_GMAIL,
    to: user.email,
    subject,
    html,
  };

  try {
    const result = await mailTransporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.response);
    return { code, expires }; // ✅ this fixes your issue!
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    return { code: null, expires: null }; // fallback if needed
  }
};
