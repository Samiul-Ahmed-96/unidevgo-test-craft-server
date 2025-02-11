"use strict";
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
exports.TestCaseControllers = void 0;
const testcase_service_1 = require("./testcase.service");
const testcase_validation_1 = require("./testcase.validation");
// Controller to create a new test case
const createTestCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { testCase } = req.body;
        // Validate test case data using Zod
        const validatedData = testcase_validation_1.testCaseValidation.TestCaseValidationSchema.parse(testCase);
        // If an attachment URL is provided, add it to customProperties
        if (req.file) {
            validatedData.customProperties.push({
                name: "Attachment",
                type: "attachment",
                value: `/uploads/${req.file.filename}`,
            });
        }
        // Create test case
        const result = yield testcase_service_1.TestCaseService.createTestCaseIntoDB(validatedData);
        res.status(201).json({
            success: true,
            message: "Test Case Added successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            error: error.errors || error.message,
        });
    }
});
// Controller to retrieve all test cases
const getAllTestCases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield testcase_service_1.TestCaseService.getAllTestCasesFromDB();
        if (result.length === 0) {
            res.status(404).json({
                success: false,
                message: "No test cases found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Test cases data retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
// Controller to fetch all modules under a project
const getTestCasesByModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId } = req.query;
        if (!moduleId || typeof moduleId !== "string") {
            res.status(400).json({
                success: false,
                message: "Invalid or missing projectId",
            });
            return;
        }
        const result = yield testcase_service_1.TestCaseService.getTestCasesByModuleFromDB(moduleId);
        res.status(200).json({
            success: true,
            message: "Modules retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
// Controller to delete a test case by ID
const deleteTestCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testCaseId } = req.params;
        const result = yield testcase_service_1.TestCaseService.deleteTestCaseFromDB(testCaseId);
        if (!result || result.matchedCount === 0) {
            res.status(404).json({
                success: false,
                message: "Test Case not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Test Case deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
// Controller to retrieve a single test case by ID
const getSingleTestCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testCaseId } = req.params;
        const result = yield testcase_service_1.TestCaseService.getSingleTestCaseFromDB(testCaseId);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Test Case not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Test Case retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
const updateTestCasesStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testCaseIds, status } = req.body;
        if (!testCaseIds || !Array.isArray(testCaseIds) || !status) {
            res.status(400).json({ success: false, message: "Invalid input data" });
            return;
        }
        const result = yield testcase_service_1.TestCaseService.updateTestCasesStatusInDB(testCaseIds, status);
        res.status(200).json({
            success: true,
            message: "Test Case status updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
const bulkDeleteTestCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testCaseIds } = req.body;
        console.log(req.body);
        if (!testCaseIds || !Array.isArray(testCaseIds)) {
            res.status(400).json({ success: false, message: "Invalid input data" });
            return;
        }
        const result = yield testcase_service_1.TestCaseService.bulkDeleteTestCasesInDB(testCaseIds);
        res.status(200).json({
            success: true,
            message: "Test Case deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
// Export all controllers
exports.TestCaseControllers = {
    createTestCase,
    getAllTestCases,
    getTestCasesByModule,
    updateTestCasesStatus,
    getSingleTestCase,
    deleteTestCase,
    bulkDeleteTestCase,
};
