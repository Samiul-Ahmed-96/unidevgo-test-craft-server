import { z } from "zod";

export const CustomPropertyValidationSchema = z.object({
  name: z.string().min(1, "Custom property name is required"),
  type: z.enum([
    "text",
    "boolean",
    "multipleOptions",
    "url",
    "attachment",
    "richText",
  ]),
  value: z.union([z.string(), z.null()]).optional(), // Ensure value is either a string (for attachments) or null
});

export const DefaultPropertiesValidationSchema = z.object({
  createdBy: z.string().min(1, "Created By is required"),
  testDescription: z.string().min(1, "Test Description is required"),
  expectedResult: z.string().min(1, "Expected Result is required"),
  status: z.enum(["Passed", "Failed", "Blocked", "Skipped", "Not Yet Tested"]),
  steps: z.string().optional(),
  executedDate: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val))
    .optional(),
  updatedDate: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val))
    .optional(),
  considerAsBug: z.boolean().optional(),
});

export const TestCaseValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  customProperties: z.array(CustomPropertyValidationSchema).default([]),
  defaultProperties: DefaultPropertiesValidationSchema.default({
    createdBy: "",
    testDescription: "",
    expectedResult: "",
    status: "Not Yet Tested",
  }),
  isDeleted: z.boolean().optional().default(false),
  isBugReportAdded: z.boolean().optional().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const testCaseValidation = {
  TestCaseValidationSchema,
};
