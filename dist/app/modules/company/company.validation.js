"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyValidation = void 0;
const zod_1 = require("zod");
const CompanyValidationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID is required"),
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password can not be more than 20 characters"),
    needsPasswordChange: zod_1.z.boolean().optional().default(false),
    subscription: zod_1.z.string().nonempty("Subscription is required"),
    profileImageUrl: zod_1.z.string().url("Invalid URL format for profile Image Url"),
    address: zod_1.z.string().min(1, "Address is required"),
    contactNumber: zod_1.z
        .string()
        .min(10, "Contact number must be at least 10 characters long"),
    isDeleted: zod_1.z.boolean().optional().default(false),
    passwordResetToken: zod_1.z.string().optional(),
    passwordResetExpires: zod_1.z.date().optional(),
});
exports.CompanyValidation = {
    CompanyValidationSchema,
};
