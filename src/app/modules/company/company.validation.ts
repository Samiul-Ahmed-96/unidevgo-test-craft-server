import { z } from "zod";

const CompanyValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password can not be more than 20 characters"),
  needsPasswordChange: z.boolean().optional().default(false),
  subscription: z.string().nonempty("Subscription is required"),
  profileImageUrl: z.string().url("Invalid URL format for profile Image Url"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 characters long"),
  isDeleted: z.boolean().optional().default(false),
  passwordResetToken: z.string().optional(),
  passwordResetExpires: z.date().optional(),
});

export const CompanyValidation = {
  CompanyValidationSchema,
};
