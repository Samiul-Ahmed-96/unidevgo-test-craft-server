import { z } from "zod";

export const ProjectValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  companyId: z.string().min(1, "Company id is required"),
  name: z.string().min(1, "Name is required"),
  region: z.string().min(1, "Region is required"),
  tag: z.string().min(1, "Tag is required"),
  isDeleted: z.boolean().optional().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const projectValidation = {
  ProjectValidationSchema,
};
