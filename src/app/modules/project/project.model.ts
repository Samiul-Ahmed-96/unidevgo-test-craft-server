import { model, Schema } from "mongoose";
import { TProject } from "./project.interface";

const ProjectSchema = new Schema<TProject>(
  {
    id: { type: String, required: true, unique: true },
    companyId: { type: String, required: true },
    name: { type: String, required: true },
    region: { type: String, required: true },
    tag: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// query middlewares
ProjectSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middlewares
ProjectSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Work on aggregate
ProjectSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const ProjectModel = model<TProject>("Project", ProjectSchema);
