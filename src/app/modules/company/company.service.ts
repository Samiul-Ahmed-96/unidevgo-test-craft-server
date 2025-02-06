import bcrypt from "bcrypt";
import config from "../../config";
import { TCompany } from "./company.interface";
import { CompanyModel } from "./company.model";

const createCompanyIntoDB = async (company: TCompany) => {
  const result = await CompanyModel.create(company);
  return result;
};

const getAllCompaniesFromDB = async () => {
  const result = await CompanyModel.find();
  return result;
};

const getSingleComapnyFromDB = async (id: string) => {
  const result = await CompanyModel.findOne({ id });
  return result;
};

const deleteCompanyFromDB = async (id: string) => {
  const result = await CompanyModel.updateOne({ id }, { isDeleted: true });
  return result;
};

const updateCompanyInDB = async (id: string, updateData: Partial<TCompany>) => {
  const result = await CompanyModel.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true }
  );
  return result;
};

const getCompanyByEmail = async (email: string) => {
  const result = await CompanyModel.findOne({ email });
  return result;
};

const updateCompanyPasswordInDB = async (id: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await CompanyModel.findOneAndUpdate(
    { id },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  return result;
};

export const CompanyServices = {
  createCompanyIntoDB,
  getAllCompaniesFromDB,
  getSingleComapnyFromDB,
  deleteCompanyFromDB,
  updateCompanyInDB,
  updateCompanyPasswordInDB,
  getCompanyByEmail,
};
