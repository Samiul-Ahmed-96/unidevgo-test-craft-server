"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseRoutes = void 0;
// routes/testCase.routes.ts
const express_1 = __importDefault(require("express"));
const testcase_controller_1 = require("./testcase.controller");
const router = express_1.default.Router();
router.get("/all", testcase_controller_1.TestCaseControllers.getAllTestCases);
// Fetch all test cases under a module (requires moduleId as query param)
router.get("/", testcase_controller_1.TestCaseControllers.getTestCasesByModule);
router.put("/update-status", testcase_controller_1.TestCaseControllers.updateTestCasesStatus);
router.put("/delete-test-case", testcase_controller_1.TestCaseControllers.bulkDeleteTestCase);
router.get("/:testCaseId", testcase_controller_1.TestCaseControllers.getSingleTestCase);
router.post("/create-test-case", testcase_controller_1.TestCaseControllers.createTestCase);
router.delete("/:testCaseId", testcase_controller_1.TestCaseControllers.deleteTestCase);
exports.TestCaseRoutes = router;
