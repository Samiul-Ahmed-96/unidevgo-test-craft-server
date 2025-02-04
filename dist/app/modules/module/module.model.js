"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleModel = void 0;
const mongoose_1 = require("mongoose");
const ModuleSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    name: { type: String, required: true },
    parentId: { type: String, default: null },
    children: [{ type: String }], // Array of submodule IDs
    testCases: [{ type: String }], // Array of test case IDs
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
ModuleSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
ModuleSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.ModuleModel = (0, mongoose_1.model)("Module", ModuleSchema);
