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
    <div style="background: linear-gradient(to bottom right, #d9f99d, #bbf7d0); padding: 40px; font-family: 'Arial', sans-serif; text-align: center; border-radius: 12px; max-width: 500px; margin: auto; box-shadow: 0px 8px 20px rgba(0,0,0,0.1);">


  <h2 style="color: #15803d; font-size: 28px; margin-bottom: 16px;">
    Welcome to <strong>Drelo Routes</strong>, <span style="color: #065f46;">${name}</span>!
  </h2>

  <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
    Thank you for joining our community! <br /> Use the code below to activate your account:
  </p>

  <p style="font-size: 2rem; font-weight: bold; color: #059669; background: #ecfdf5; display: inline-block; padding: 10px 20px; border-radius: 10px; margin: 20px 0;">
    ${code}
  </p>

  <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
    This code expires in <strong>1 hour</strong>.
  </p>

  <a href="https://your-frontend-link.com/activateacc" style="background-color: #22c55e; color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-size: 16px;">
    Activate My Account
  </a>

  <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
    If you did not sign up for Drelo Routes, please ignore this email.
  </p>

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



export const sendMail = async (user, subject, type, code) => {

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
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};
