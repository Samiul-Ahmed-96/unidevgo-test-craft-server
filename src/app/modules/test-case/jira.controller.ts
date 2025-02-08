import axios from "axios";
import { Request, Response } from "express";

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

const createJiraIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCase } = req.body;

    if (!testCase) {
      res
        .status(400)
        .json({ success: false, message: "Test case data is required" });
      return;
    }

    // Extract optional default properties
    const {
      createdBy,
      testDescription,
      expectedResult,
      status,
      executedDate,
      updatedDate,
      considerAsBug,
    } = testCase.defaultProperties || {};

    const title = testDescription || "No title provided";

    // Base description with test case tracking details
    const adfDescription: any = {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: `Test Case ID: ${testCase.id}` }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: `Module ID: ${testCase.moduleId}` }],
        },
      ],
    };

    // Append default properties if available
    if (createdBy)
      adfDescription.content.push({
        type: "paragraph",
        content: [{ type: "text", text: `Created By : ${createdBy}` }],
      });
    if (expectedResult)
      adfDescription.content.push({
        type: "paragraph",
        content: [
          { type: "text", text: `Expected Result : ${expectedResult}` },
        ],
      });
    if (status)
      adfDescription.content.push({
        type: "paragraph",
        content: [{ type: "text", text: `Status : ${status}` }],
      });
    if (executedDate)
      adfDescription.content.push({
        type: "paragraph",
        content: [{ type: "text", text: `Executed Date : ${executedDate}` }],
      });
    if (updatedDate)
      adfDescription.content.push({
        type: "paragraph",
        content: [{ type: "text", text: `Updated Date : ${updatedDate}` }],
      });

    // Append custom properties
    if (testCase.customProperties && testCase.customProperties.length > 0) {
      testCase.customProperties.forEach((property: any) => {
        adfDescription.content.push({
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `Custom Property - Name : ${property.name} | Value : ${property.value} | Type : (${property.type})`,
            },
          ],
        });
      });
    }

    // Jira issue data
    const jiraIssueData = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary: title,
        description: adfDescription,
        issuetype: { name: "Task" },
        labels: ["Test-Craft-APP", "Test-Case"],
      },
    };

    // Authentication
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
      "base64"
    );

    // Send request to Jira
    const jiraResponse = await axios.post(JIRA_BASE_URL, jiraIssueData, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    res.status(201).json({
      success: true,
      message: "Jira Issue Created successfully",
      data: jiraResponse.data,
    });
  } catch (error: any) {
    console.error(
      "Error creating Jira issue:",
      error.response?.data || error.message
    );
    res.status(400).json({
      success: false,
      message: "Failed to create Jira Issue",
      error: error.response?.data || error.message,
    });
  }
};

export const JiraController = { createJiraIssue };
