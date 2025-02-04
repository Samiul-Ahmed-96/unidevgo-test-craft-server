"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleValidation = exports.ModuleValidationSchema = void 0;
const zod_1 = require("zod");
exports.ModuleValidationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID is required"),
    projectId: zod_1.z.string().min(1, "Project ID is required"),
    name: zod_1.z.string().min(1, "Name is required"),
    parentId: zod_1.z.string().optional(),
    children: zod_1.z.array(zod_1.z.string()).optional().default([]),
    testCases: zod_1.z.array(zod_1.z.string()).optional().default([]),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
exports.moduleValidation = {
    ModuleValidationSchema: exports.ModuleValidationSchema,
};
