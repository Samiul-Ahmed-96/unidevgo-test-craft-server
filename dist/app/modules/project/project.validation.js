"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectValidation = exports.ProjectValidationSchema = void 0;
const zod_1 = require("zod");
exports.ProjectValidationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID is required"),
    companyId: zod_1.z.string().min(1, "Company id is required"),
    name: zod_1.z.string().min(1, "Name is required"),
    region: zod_1.z.string().min(1, "Region is required"),
    tag: zod_1.z.string().min(1, "Tag is required"),
    isDeleted: zod_1.z.boolean().optional().default(false),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.projectValidation = {
    ProjectValidationSchema: exports.ProjectValidationSchema,
};
