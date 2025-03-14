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
exports.CompanyControllers = exports.requestPasswordReset = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const company_service_1 = require("./company.service");
const company_validation_1 = require("./company.validation");
// Utility function for centralized error handling
const handleError = (res, error, statusCode = 500, defaultMessage = "Something went wrong") => {
    console.error("Error:", error); // Log the error for debugging
    const message = error instanceof zod_1.ZodError
        ? error.errors.map((e) => e.message).join(", ") // Format validation errors
        : error.message || defaultMessage;
    res.status(statusCode).json({
        success: false,
        message,
        error: error.stack || error, // Include stack trace for debugging in non-production environments
    });
};
// Controller to create a new company
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company: companyData } = req.body;
        const zodParsedData = company_validation_1.CompanyValidation.CompanyValidationSchema.parse(companyData);
        // Save company to the database
        const result = yield company_service_1.CompanyServices.createCompanyIntoDB(Object.assign(Object.assign({}, zodParsedData), { passwordResetToken: zodParsedData.passwordResetToken || "", passwordResetExpires: zodParsedData.passwordResetExpires || new Date() }));
        res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            handleError(res, error, 400, "Validation error");
        }
        else {
            handleError(res, error);
        }
    }
});
// Controller to retrieve all companies
const getAllCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield company_service_1.CompanyServices.getAllCompaniesFromDB();
        if (result.length === 0) {
            res.status(404).json({
                success: false,
                message: "No companies found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Companies data retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
// Controller to retrieve a single company by ID
const getSingleCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.params;
        const result = yield company_service_1.CompanyServices.getSingleComapnyFromDB(companyId);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Company not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Company retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
// Controller to delete a company by ID
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.params;
        const result = yield company_service_1.CompanyServices.deleteCompanyFromDB(companyId);
        if (!result.matchedCount) {
            res.status(404).json({
                success: false,
                message: "Company not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Company deleted successfully",
            data: result,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
// Controller to update a company's details
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.params;
        const updateData = req.body;
        // Validate the update data
        if (!updateData) {
            res.status(400).json({
                success: false,
                message: "No update data provided",
            });
            return;
        }
        const result = yield company_service_1.CompanyServices.updateCompanyInDB(companyId, updateData);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Company not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: result,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
// Controller for company login
const loginCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        // Find the company by email
        const company = yield company_service_1.CompanyServices.getCompanyByEmail(email);
        if (!company || company.isDeleted) {
            res.status(404).json({
                success: false,
                message: "Invalid email or company not found",
            });
            return;
        }
        // Verify password with bcrypt
        const isPasswordValid = yield bcrypt_1.default.compare(password, company.password);
        console.log("Password Match:", isPasswordValid);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid password",
            });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({
            _id: company._id,
            id: company.id,
            name: company.name,
            email: company.email,
        }, process.env.JWT_SECRET || "jwt_secret", { expiresIn: "1h" });
        res.status(200).json({
            success: true,
            message: "Login successfully",
            token,
            profile: {
                _id: company._id,
                id: company.id,
                name: company.name,
                email: company.email,
                subscription: company.subscription,
                profileImageUrl: company.profileImageUrl,
                address: company.address,
                contactNumber: company.contactNumber,
            },
            role: "company",
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        handleError(res, error);
    }
});
// Controller to update a company's password
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.params;
        const { currentPassword, newPassword } = req.body;
        // Validate input
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
            return;
        }
        const company = yield company_service_1.CompanyServices.getSingleComapnyFromDB(companyId);
        if (!company || company.isDeleted) {
            res.status(404).json({
                success: false,
                message: "Company not found",
            });
            return;
        }
        // Verify current password
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, company.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
            return;
        }
        // Update password
        const result = yield company_service_1.CompanyServices.updateCompanyPasswordInDB(companyId, newPassword);
        if (!result) {
            res.status(500).json({
                success: false,
                message: "Failed to update password",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
// Request Password Reset Token
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield company_service_1.CompanyServices.generatePasswordResetToken(email);
        res.json({ message: "Reset token sent to email" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.requestPasswordReset = requestPasswordReset;
// Controller to reset the company's password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    // Hash the token and compare
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const company = yield company_service_1.CompanyServices.getCompanyByResetToken(hashedToken);
    if (!company || company.passwordResetExpires < new Date()) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
    }
    const result = yield company_service_1.CompanyServices.updateCompanyPasswordInDB(company.id, newPassword);
    if (!result) {
        res.status(500).json({ message: "Failed to reset password" });
        return;
    }
    res.status(200).json({ message: "Password reset successfully" });
});
// Export all controllers
exports.CompanyControllers = {
    createCompany,
    getAllCompanies,
    getSingleCompany,
    deleteCompany,
    updateCompany,
    loginCompany,
    updatePassword,
    requestPasswordReset: exports.requestPasswordReset,
    resetPassword,
};
