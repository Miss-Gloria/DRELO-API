import { UserModel } from "../models/user_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { confirmUserEmailValidator, forgotPasswordValidator, loginUserValidator, registerUserValidator, resetPasswordValidator } from "../validators/user_validator.js";
import { sendMail, generateMailCode, generateMailCodeExpires } from "../utils/mail.js";


export const registerUser = async (req, res) => {
  const { error, value } = registerUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  // ✅ Only check if email is already registered
  const existingUser = await UserModel.findOne({ email: value.email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);

  // Step 1: Create user (without code)
  const newUser = await UserModel.create({
    ...value,
    password: hashedPassword,
    verified: false,
  });

  // Step 2: Generate code and expiry
  const mailCode = generateMailCode();
  const mailCodeExpires = generateMailCodeExpires();

  // Step 3: Send email with code
  await sendMail(
    newUser,
    "Activate Your Drelo Routes Account",
    "verify",
    mailCode
  );

  // Step 4: Save code to user
  await UserModel.findByIdAndUpdate(newUser._id, {
    mailCode,
    mailCodeExpires,
  });

  // Step 5: Final response
  res.status(201).json({
    message: "User created successfully. Please check your email to verify your account.",
  });
};


export const confirmNewUserEmail = async (req, res) => {
  const { error, value } = confirmUserEmailValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const user = await UserModel.findOne({
    mailCode: value.code,
    mailCodeExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  user.mailCode = null;
  user.mailCodeExpires = null;
  user.verified = true;
  await user.save();

  res.status(200).json({ message: "Account activated successfully" });
};

export const loginUser = async (req, res) => {
  //Validate user information
  const { error, value } = loginUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  //Find matching user record in database
  const user = await UserModel
    .findOne({ email: value.email })
    .select("name verified password");
  if (!user) {
    return res.status(404).json({ error: "User does not exist!" });
  }

if (!user.verified) {
  return res.status(403).json({ error: "Please verify your email before logging in." });
}
  //Compare incoming password with saved password
  const correctPassword = bcrypt.compareSync(value.password, user.password);
  if (!correctPassword) {
    return res.status(401).json({ error: "Invalid Credentials!" });
  }
  //Generate access token for user

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_VALIDITY || "24h",
  });
  //Return response
  res.status(200).json({
    accessToken,
    user: { 
      id: user.id,
      name: user.name,
     isAuthuenticated: true
    },
  });
};


export const forgotPassword = async (req, res) => {
  const { error, value } = forgotPasswordValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const user = await UserModel.findOne({ email: value.email });
  if (!user) {
    return res.status(200).json({
      message: "You will receive a reset code in your email",
    });
  }

  // Generate new reset code and expiration
  const mailCode = generateMailCode();
  const mailCodeExpires = generateMailCodeExpires();

  // Save code and expiration
  await UserModel.findByIdAndUpdate(user._id, {
    mailCode,
    mailCodeExpires,
  });

  // Re-fetch updated user with code
  const updatedUser = await UserModel.findById(user._id);

  // Send reset email with the same code now stored in the DB
  await sendMail(
    updatedUser,
    "Reset your Drelo Routes password",
    "reset",
    mailCode
  );



  res.status(200).json({
    message: "You will receive a reset code in your email",
  });
};


export const resetPassword = async (req, res) => {
  const { error, value } = resetPasswordValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const user = await UserModel.findOne({
    mailCode: value.code,
    mailCodeExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  const hashedPassword = await bcrypt.hash(value.newPassword, 12);

  await UserModel.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    mailCode: null,
    mailCodeExpires: null,
  });

  res.status(200).json({ message: "Password reset successfully" });
};



export const getAuthenticatedUser = async (req, res, next) => {
 try {
   //Get user by id using req.auth.id
   const result = await UserModel
   .findById(req.auth.id)
   .select({password: false })
   //Return response
   res.status(200).json(result);
 } catch (error) {
  next(error);
 } 
}
