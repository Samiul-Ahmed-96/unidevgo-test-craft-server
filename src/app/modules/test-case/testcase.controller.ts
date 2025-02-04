// controllers/testCase.controller.ts
import { Request, Response } from "express";
import { TestCaseService } from "./testcase.service";
import { testCaseValidation } from "./testcase.validation";

// Controller to create a new test case
const createTestCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCase: testCaseData } = req.body;

    // Validate and parse using Zod schema
    const zodParseData =
      testCaseValidation.TestCaseValidationSchema.parse(testCaseData);

    // Create the test case in the database
    const result = await TestCaseService.createTestCaseIntoDB(zodParseData);

    res.status(201).json({
      success: true,
      message: "Test Case Added successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Controller to retrieve all test cases
const getAllTestCases = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await TestCaseService.getAllTestCasesFromDB();

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Controller to fetch all modules under a project
const getTestCasesByModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { moduleId } = req.query;

    if (!moduleId || typeof moduleId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid or missing projectId",
      });
      return;
    }

    const result = await TestCaseService.getTestCasesByModuleFromDB(moduleId);

    res.status(200).json({
      success: true,
      message: "Modules retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Controller to delete a test case by ID
const deleteTestCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCaseId } = req.params;

    const result = await TestCaseService.deleteTestCaseFromDB(testCaseId);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Controller to retrieve a single test case by ID
const getSingleTestCase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { testCaseId } = req.params;

    const result = await TestCaseService.getSingleTestCaseFromDB(testCaseId);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateTestCasesStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { testCaseIds, status } = req.body;

    if (!testCaseIds || !Array.isArray(testCaseIds) || !status) {
      res.status(400).json({ success: false, message: "Invalid input data" });
      return;
    }

    const result = await TestCaseService.updateTestCasesStatusInDB(
      testCaseIds,
      status
    );

    res.status(200).json({
      success: true,
      message: "Test Case status updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const bulkDeleteTestCase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { testCaseIds } = req.body;

    console.log(req.body);

    if (!testCaseIds || !Array.isArray(testCaseIds)) {
      res.status(400).json({ success: false, message: "Invalid input data" });
      return;
    }

    const result = await TestCaseService.bulkDeleteTestCasesInDB(testCaseIds);

    res.status(200).json({
      success: true,
      message: "Test Case deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Export all controllers
export const TestCaseControllers = {
  createTestCase,
  getAllTestCases,
  getTestCasesByModule,
  updateTestCasesStatus,
  getSingleTestCase,
  deleteTestCase,
  bulkDeleteTestCase,
};
