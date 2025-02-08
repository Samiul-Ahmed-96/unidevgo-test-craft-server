"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCaseValidation = exports.TestCaseValidationSchema = exports.DefaultPropertiesValidationSchema = exports.CustomPropertyValidationSchema = void 0;
const zod_1 = require("zod");
exports.CustomPropertyValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Custom property name is required"),
    type: zod_1.z.enum(["text", "boolean", "multipleOptions", "url", "attachment"]),
    value: zod_1.z.string().min(1, "Custom property value is required"),
});
exports.DefaultPropertiesValidationSchema = zod_1.z.object({
    createdBy: zod_1.z.string().min(1, "Created By is required"),
    testDescription: zod_1.z.string().min(1, "Test Description is required"),
    expectedResult: zod_1.z.string().min(1, "Expected Result is required"),
    status: zod_1.z.enum(["Passed", "Failed", "Blocked", "Skipped", "Not Yet Tested"]),
    executedDate: zod_1.z
        .union([zod_1.z.string(), zod_1.z.date()])
        .transform((val) => new Date(val))
        .optional(),
    updatedDate: zod_1.z
        .union([zod_1.z.string(), zod_1.z.date()])
        .transform((val) => new Date(val))
        .optional(),
    considerAsBug: zod_1.z.boolean().optional(),
});
exports.TestCaseValidationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID is required"),
    moduleId: zod_1.z.string().min(1, "Module ID is required"),
    customProperties: zod_1.z.array(exports.CustomPropertyValidationSchema).default([]),
    defaultProperties: exports.DefaultPropertiesValidationSchema.default({
        createdBy: "",
        testDescription: "",
        expectedResult: "",
        status: "Not Yet Tested",
    }),
    isDeleted: zod_1.z.boolean().optional().default(false),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.testCaseValidation = {
    TestCaseValidationSchema: exports.TestCaseValidationSchema,
};
