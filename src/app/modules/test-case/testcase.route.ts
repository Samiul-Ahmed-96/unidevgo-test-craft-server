// routes/testCase.routes.ts
import express from "express";
import { upload } from "./fileUpload.service";
import { JiraController } from "./jira.controller";

import { TestCaseControllers } from "./testcase.controller";

const router = express.Router();

router.post("/upload-attachment", upload.single("file"), (req, res): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded." });
      return;
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error });
  }
});

// Jira routes with async handling
router.post("/create-jira-issue", async (req, res) => {
  try {
    await JiraController.createJiraIssue(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});
// Route to fetch Jira Projects using dynamic user authentication
router.get("/get-jira-projects", async (req, res) => {
  try {
    await JiraController.getJiraProjects(req, res); // Call the controller
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});
// Fetch Jira Fields Route
router.get("/get-jira-fields", async (req, res) => {
  try {
    await JiraController.fetchJiraFields(req, res); // Call the controller
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

//Test Case Routes
router.get("/all", TestCaseControllers.getAllTestCases);
// Fetch all test cases under a module (requires moduleId as query param)
router.get("/", TestCaseControllers.getTestCasesByModule);
router.put("/update-status", TestCaseControllers.updateTestCasesStatus);
router.put("/delete-test-case", TestCaseControllers.bulkDeleteTestCase);
router.get("/:testCaseId", TestCaseControllers.getSingleTestCase);
router.put("/:testCaseId", TestCaseControllers.updateTestCase);
router.post("/create-test-case", TestCaseControllers.createTestCase);
router.delete("/:testCaseId", TestCaseControllers.deleteTestCase);

export const TestCaseRoutes = router;
