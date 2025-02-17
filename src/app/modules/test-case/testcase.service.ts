// services/testCase.service.ts

import { TTestCase } from "./testcase.interface";
import { TestCaseModel } from "./testcase.model";

const createTestCaseIntoDB = async (testCase: TTestCase) => {
  const result = await TestCaseModel.create(testCase);
  return result;
};

const getAllTestCasesFromDB = async () => {
  const result = await TestCaseModel.find();
  return result;
};

// Fetch all modules under a module
const getTestCasesByModuleFromDB = async (moduleId: string) => {
  return await TestCaseModel.find({ moduleId });
};

const deleteTestCaseFromDB = async (id: string) => {
  const result = await TestCaseModel.updateOne({ id }, { isDeleted: true });
  return result;
};

const getSingleTestCaseFromDB = async (id: string) => {
  const result = await TestCaseModel.findOne({ id });
  return result;
};

const updateTestCasesStatusInDB = async (
  testCaseIds: string[],
  status: string
) => {
  return await TestCaseModel.updateMany(
    { _id: { $in: testCaseIds } }, // Match all selected IDs
    { $set: { "defaultProperties.status": status } } // Update status field
  );
};
const bulkDeleteTestCasesInDB = async (testCaseIds: string[]) => {
  return await TestCaseModel.updateMany(
    { _id: { $in: testCaseIds } }, // Match all selected IDs
    { $set: { isDeleted: true } } // Update status field
  );
};

const updateTestCaseInDB = async (
  id: string,
  updateData: Partial<TTestCase>
) => {
  const result = await TestCaseModel.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true }
  );
  return result;
};

export const TestCaseService = {
  createTestCaseIntoDB,
  getAllTestCasesFromDB,
  getTestCasesByModuleFromDB,
  getSingleTestCaseFromDB,
  deleteTestCaseFromDB,
  bulkDeleteTestCasesInDB,
  updateTestCaseInDB,
  updateTestCasesStatusInDB,
};
