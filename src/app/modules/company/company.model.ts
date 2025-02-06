import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../config";
import { TCompany } from "./company.interface";

const CompanySchema = new Schema<TCompany>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: false },
    subscription: { type: String },
    profileImageUrl: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Pre save middleware hook
CompanySchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const company = this;
  //hashing password
  company.password = await bcrypt.hash(
    company.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

//post save middleware / hooks
CompanySchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// query middlewares
// Work on find operation (Get only isDeleted those documents where isDeleted : false )
// So that we cant get the deleted items
CompanySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middlewares
// Work on findOne operation (Get only isDeleted those documents where isDeleted : false )
// So that we cant get the deleted items
CompanySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Work on aggregate
CompanySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const CompanyModel = model<TCompany>("Company", CompanySchema);
