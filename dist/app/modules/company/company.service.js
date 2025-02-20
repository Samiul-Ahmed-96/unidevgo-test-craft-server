"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
const company_model_1 = require("./company.model");
const createCompanyIntoDB = (company) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.CompanyModel.create(company);
    return result;
});
const getAllCompaniesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.CompanyModel.find();
    return result;
});
const getSingleComapnyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.CompanyModel.findOne({ id });
    return result;
});
const deleteCompanyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.CompanyModel.updateOne({ id }, { isDeleted: true });
    return result;
});
const updateCompanyInDB = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.CompanyModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
    return result;
});
const getCompanyByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.CompanyModel.findOne({ email });
    return result;
});
const updateCompanyPasswordInDB = (id, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    console.log("Hashed Password:", hashedPassword); // Debugging line
    const result = yield company_model_1.CompanyModel.findOneAndUpdate({ id }, { $set: { password: hashedPassword } }, { new: true });
    return result;
});
// Generate Password Reset Token
const generatePasswordResetToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield company_model_1.CompanyModel.findOne({ email });
    if (!company) {
        throw new Error("Company not found");
    }
    // Generate Token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    // Store Hashed Token & Expiry
    company.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    company.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes
    yield company.save();
    // Send Token via Email
    yield sendResetEmail(company.email, resetToken);
});
// Send Email Function
const sendResetEmail = (email, resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: config_1.default.sender_email,
            pass: config_1.default.sender_password,
        },
    });
    yield transporter.sendMail({
        from: `"Test Craft" <noreply@yourcompany.com>`,
        to: email,
        subject: "Password Reset Request",
        text: `Your password reset token is: ${resetToken}`,
        html: `<p>Your password reset token is: <strong>${resetToken}</strong></p>`,
    });
});
const getCompanyByResetToken = (hashedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_model_1.CompanyModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() }, // Ensure token hasn't expired
    });
    return result;
});
exports.CompanyServices = {
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
