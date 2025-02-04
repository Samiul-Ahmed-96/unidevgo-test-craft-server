import { model, Schema } from "mongoose";
import { TModule } from "./module.interface";

const ModuleSchema = new Schema<TModule>(
  {
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    name: { type: String, required: true },
    parentId: { type: String, default: null },
    children: [{ type: String }], // Array of submodule IDs
    testCases: [{ type: String }], // Array of test case IDs
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ModuleSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ModuleSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const ModuleModel = model<TModule>("Module", ModuleSchema);
