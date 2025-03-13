// controllers/testCase.controller.ts
import { Request, Response } from "express";
import { TestCaseService } from "./testcase.service";
import { testCaseValidation } from "./testcase.validation";

// Controller to create a new test case
const createTestCase = async (req: Request, res: Response): Promise<void> => {
  try {
    let { testCase } = req.body;
    console.log("testCase", testCase);

    // Validate test case data using Zod
    const validatedData =
      testCaseValidation.TestCaseValidationSchema.parse(testCase);

    // Ensure customProperties exists
    if (!validatedData.customProperties) {
      validatedData.customProperties = [];
    }

    // If an attachment is uploaded, add it to customProperties
    if (req.file) {
      validatedData.customProperties.push({
        name: "Attachment",
        type: "attachment",
        value: `/uploads/${req.file.filename}`,
      });
    }

    // Ensure all customProperties have a value (cannot be null or undefined)
    validatedData.customProperties = validatedData.customProperties.map(
      (prop) => ({
        ...prop,
        value: prop.value || "", // Replace null/undefined values with empty string
      })
    );

    // Create test case
    // Cast validatedData to the expected type to ensure compatibility with the service
    const result = await TestCaseService.createTestCaseIntoDB(
      validatedData as any
    ); //explicit type assertion to bypass the type check

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

    const reverseData = result.reverse();

    res.status(200).json({
      success: true,
      message: "Modules retrieved successfully",
      data: reverseData,
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
// Controller to delete a test case by ID
const updateBugField = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCaseId } = req.params;

    const result = await TestCaseService.updateBugFieldInDB(testCaseId);

    if (!result || result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Test Case not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Bug field update successfully",
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

// Controller to update an project's details
const updateTestCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCaseId } = req.params;
    const updateData = req.body;

    // Check if update data is provided
    if (!updateData) {
      res.status(400).json({
        success: false,
        message: "No update data provided",
      });
      return;
    }

    const result = await TestCaseService.updateTestCaseInDB(
      testCaseId,
      updateData
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Test case not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Test case updated successfully",
      data: result,
    });
  } catch (error) {
    res.send(error);
  }
};

// Export all controllers
export const TestCaseControllers = {
  createTestCase,
  getAllTestCases,
  getTestCasesByModule,
  updateBugField,
  updateTestCasesStatus,
  getSingleTestCase,
  updateTestCase,
  deleteTestCase,
  bulkDeleteTestCase,
};
