import { z } from "zod";

export const ModuleValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  name: z.string().min(1, "Name is required"),
  parentId: z.string().optional(),
  children: z.array(z.string()).optional().default([]),
  testCases: z.array(z.string()).optional().default([]),
  isDeleted: z.boolean().optional().default(false),
});

export const moduleValidation = {
  ModuleValidationSchema,
};
