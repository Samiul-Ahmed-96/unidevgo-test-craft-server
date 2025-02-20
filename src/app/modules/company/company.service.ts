import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import config from "../../config";
import { TCompany } from "./company.interface";
import { CompanyModel } from "./company.model";

const createCompanyIntoDB = async (company: TCompany) => {
  const result = await CompanyModel.create(company);
  return result;
};

const getAllCompaniesFromDB = async () => {
  const result = await CompanyModel.find();
  return result;
};

const getSingleComapnyFromDB = async (id: string) => {
  const result = await CompanyModel.findOne({ id });
  return result;
};

const deleteCompanyFromDB = async (id: string) => {
  const result = await CompanyModel.updateOne({ id }, { isDeleted: true });
  return result;
};

const updateCompanyInDB = async (id: string, updateData: Partial<TCompany>) => {
  const result = await CompanyModel.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true }
  );
  return result;
};

const getCompanyByEmail = async (email: string) => {
  const result = await CompanyModel.findOne({ email });
  return result;
};

const updateCompanyPasswordInDB = async (id: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  console.log("Hashed Password:", hashedPassword); // Debugging line
  const result = await CompanyModel.findOneAndUpdate(
    { id },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  return result;
};

// Generate Password Reset Token
const generatePasswordResetToken = async (email: string) => {
  const company = await CompanyModel.findOne({ email });
  if (!company) {
    throw new Error("Company not found");
  }

  // Generate Token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store Hashed Token & Expiry
  company.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  company.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes
  await company.save();

  // Send Token via Email
  await sendResetEmail(company.email, resetToken);
};

// Send Email Function
const sendResetEmail = async (email: string, resetToken: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.sender_email,
      pass: config.sender_password,
    },
  });

  await transporter.sendMail({
    from: `"Test Craft" <noreply@yourcompany.com>`,
    to: email,
    subject: "Password Reset Request",
    text: `Your password reset token is: ${resetToken}`,
    html: `<p>Your password reset token is: <strong>${resetToken}</strong></p>`,
  });
};

const getCompanyByResetToken = async (hashedToken: string) => {
  const result = await CompanyModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }, // Ensure token hasn't expired
  });
  return result;
};

export const CompanyServices = {
  createCompanyIntoDB,
  getAllCompaniesFromDB,
  getSingleComapnyFromDB,
  deleteCompanyFromDB,
  updateCompanyInDB,
  updateCompanyPasswordInDB,
  getCompanyByEmail,
  generatePasswordResetToken,
  getCompanyByResetToken,
};
