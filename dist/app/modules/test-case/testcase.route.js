"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseRoutes = void 0;
// routes/testCase.routes.ts
const express_1 = __importDefault(require("express"));
const fileUpload_service_1 = require("./fileUpload.service");
const jira_controller_1 = require("./jira.controller");
const testcase_controller_1 = require("./testcase.controller");
const router = express_1.default.Router();
router.post("/upload-attachment", fileUpload_service_1.upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded." });
            return;
        }
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            fileUrl,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error });
    }
});
// Add Jira issue creation route
router.post("/create-jira-issue", jira_controller_1.JiraController.createJiraIssue);
router.get("/get-jira-projects", jira_controller_1.JiraController.getJiraProjects);
router.get("/all", testcase_controller_1.TestCaseControllers.getAllTestCases);
// Fetch all test cases under a module (requires moduleId as query param)
router.get("/", testcase_controller_1.TestCaseControllers.getTestCasesByModule);
router.put("/update-status", testcase_controller_1.TestCaseControllers.updateTestCasesStatus);
router.put("/delete-test-case", testcase_controller_1.TestCaseControllers.bulkDeleteTestCase);
router.get("/:testCaseId", testcase_controller_1.TestCaseControllers.getSingleTestCase);
router.post("/create-test-case", testcase_controller_1.TestCaseControllers.createTestCase);
router.delete("/:testCaseId", testcase_controller_1.TestCaseControllers.deleteTestCase);
exports.TestCaseRoutes = router;
