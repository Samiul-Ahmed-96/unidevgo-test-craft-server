// routes/testCase.routes.ts
import express from "express";
import { TestCaseControllers } from "./testcase.controller";

const router = express.Router();

router.get("/all", TestCaseControllers.getAllTestCases);
// Fetch all test cases under a module (requires moduleId as query param)
router.get("/", TestCaseControllers.getTestCasesByModule);
router.put("/update-status", TestCaseControllers.updateTestCasesStatus);
router.put("/delete-test-case", TestCaseControllers.bulkDeleteTestCase);
router.get("/:testCaseId", TestCaseControllers.getSingleTestCase);
router.post("/create-test-case", TestCaseControllers.createTestCase);
router.delete("/:testCaseId", TestCaseControllers.deleteTestCase);

export const TestCaseRoutes = router;
