"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseModel = void 0;
// models/TestCase.model.ts
const mongoose_1 = require("mongoose");
const CustomPropertySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: [
            "text",
            "boolean",
            "multipleOptions",
            "url",
            "attachment",
            "richText",
        ],
        required: true,
    },
    value: { type: String, required: true },
});
const DefaultPropertiesSchema = new mongoose_1.Schema({
    createdBy: { type: String, required: true },
    testDescription: { type: String, required: true },
    expectedResult: { type: String, required: true },
    status: {
        type: String,
        enum: ["Passed", "Failed", "Blocked", "Skipped", "Not Yet Tested"],
        default: "Not Yet Tested",
    },
    executedDate: { type: Date },
    updatedDate: { type: Date },
    considerAsBug: { type: Boolean, default: false },
});
const TestCaseSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true }, // Use this as a unique identifier
    moduleId: { type: String, required: true },
    customProperties: [CustomPropertySchema],
    defaultProperties: DefaultPropertiesSchema,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Query middleware to exclude deleted items
TestCaseSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
TestCaseSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
TestCaseSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.TestCaseModel = (0, mongoose_1.model)("TestCase", TestCaseSchema);
