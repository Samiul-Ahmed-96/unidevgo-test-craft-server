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
// Jira routes with async handling
router.post("/create-jira-issue", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield jira_controller_1.JiraController.createJiraIssue(req, res);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
}));
// Route to fetch Jira Projects using dynamic user authentication
router.get("/get-jira-projects", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield jira_controller_1.JiraController.getJiraProjects(req, res); // Call the controller
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
}));
// Fetch Jira Fields Route
router.get("/get-jira-fields", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield jira_controller_1.JiraController.fetchJiraFields(req, res); // Call the controller
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
}));
//Test Case Routes
router.get("/all", testcase_controller_1.TestCaseControllers.getAllTestCases);
// Fetch all test cases under a module (requires moduleId as query param)
router.get("/", testcase_controller_1.TestCaseControllers.getTestCasesByModule);
router.put("/update-status", testcase_controller_1.TestCaseControllers.updateTestCasesStatus);
router.put("/delete-test-case", testcase_controller_1.TestCaseControllers.bulkDeleteTestCase);
router.get("/:testCaseId", testcase_controller_1.TestCaseControllers.getSingleTestCase);
router.put("/:testCaseId", testcase_controller_1.TestCaseControllers.updateTestCase);
router.post("/create-test-case", testcase_controller_1.TestCaseControllers.createTestCase);
router.delete("/:testCaseId", testcase_controller_1.TestCaseControllers.deleteTestCase);
exports.TestCaseRoutes = router;
