// models/TestCase.model.ts
import { model, Schema } from "mongoose";
import { TCustomProperty, TTestCase } from "./testcase.interface";

const CustomPropertySchema = new Schema<TCustomProperty>({
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

const DefaultPropertiesSchema = new Schema({
  createdBy: { type: String, required: true },
  testDescription: { type: String, required: true },
  expectedResult: { type: String, required: true },
  status: {
    type: String,
    enum: ["Passed", "Failed", "Blocked", "Skipped", "Not Yet Tested"],
    default: "Not Yet Tested",
  },
  executedDate: { type: Date },
  steps: { type: String },
  updatedDate: { type: Date },
  considerAsBug: { type: Boolean, default: false },
});

const TestCaseSchema = new Schema<TTestCase>(
  {
    id: { type: String, required: true, unique: true }, // Use this as a unique identifier
    moduleId: { type: String, required: true },
    customProperties: [CustomPropertySchema],
    defaultProperties: DefaultPropertiesSchema,
    isDeleted: { type: Boolean, default: false },
    isBugReportAdded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

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

export const TestCaseModel = model<TTestCase>("TestCase", TestCaseSchema);
