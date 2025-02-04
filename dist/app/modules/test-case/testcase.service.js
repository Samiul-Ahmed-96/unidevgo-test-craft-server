"use strict";
// services/testCase.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseService = void 0;
const testcase_model_1 = require("./testcase.model");
const createTestCaseIntoDB = (testCase) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield testcase_model_1.TestCaseModel.create(testCase);
    return result;
});
const getAllTestCasesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield testcase_model_1.TestCaseModel.find();
    return result;
});
// Fetch all modules under a module
const getTestCasesByModuleFromDB = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield testcase_model_1.TestCaseModel.find({ moduleId });
});
const deleteTestCaseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield testcase_model_1.TestCaseModel.updateOne({ id }, { isDeleted: true });
    return result;
});
const getSingleTestCaseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield testcase_model_1.TestCaseModel.findOne({ id });
    return result;
});
const updateTestCasesStatusInDB = (testCaseIds, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield testcase_model_1.TestCaseModel.updateMany({ _id: { $in: testCaseIds } }, // Match all selected IDs
    { $set: { "defaultProperties.status": status } } // Update status field
    );
});
const bulkDeleteTestCasesInDB = (testCaseIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield testcase_model_1.TestCaseModel.updateMany({ _id: { $in: testCaseIds } }, // Match all selected IDs
    { $set: { isDeleted: true } } // Update status field
    );
});
exports.TestCaseService = {
    createTestCaseIntoDB,
    getAllTestCasesFromDB,
    getTestCasesByModuleFromDB,
    getSingleTestCaseFromDB,
    deleteTestCaseFromDB,
    bulkDeleteTestCasesInDB,
    updateTestCasesStatusInDB,
};
