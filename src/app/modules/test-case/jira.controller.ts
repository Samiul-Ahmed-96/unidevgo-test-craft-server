import axios from "axios";
import { Request, Response } from "express";

// Jira Issue Creation
const createJiraIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCase, projectKey, jiraBaseUrl, jiraEmail, jiraApiToken } =
      req.body;
    if (
      !testCase ||
      !projectKey ||
      !jiraBaseUrl ||
      !jiraEmail ||
      !jiraApiToken
    ) {
      res.status(400).json({
        success: false,
        message:
          "Test case data, project key, Jira Base URL, Email, and API token are required.",
      });
      return;
    }

    const {
      createdBy,
      testDescription,
      expectedResult,
      status,
      executedDate,
      updatedDate,
    } = testCase.defaultProperties || {};

    const title = testDescription || "No title provided";

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

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    };

    const addPropertyToDescription = (label: string, value: string) => {
      if (value) {
        const formattedValue = label.includes("Date")
          ? formatDate(value)
          : value;
        adfDescription.content.push({
          type: "paragraph",
          content: [{ type: "text", text: `${label}: ${formattedValue}` }],
        });
      }
    };

    addPropertyToDescription("Created By", createdBy);
    addPropertyToDescription("Expected Result", expectedResult);
    addPropertyToDescription("Status", status);
    addPropertyToDescription("Executed Date", executedDate);
    addPropertyToDescription("Updated Date", updatedDate);

    if (testCase.customProperties && testCase.customProperties.length > 0) {
      testCase.customProperties.forEach((property: any) => {
        adfDescription.content.push({
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `Custom Property - Name: ${property.name} | Value: ${property.value} | Type: (${property.type})`,
            },
          ],
        });
      });
    }

    const jiraIssueData = {
      fields: {
        project: { key: projectKey },
        summary: title,
        description: adfDescription,
        issuetype: { name: "Task" },
        labels: ["Test-Craft-APP", "Test-Case"],
      },
    };

    const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");

    const jiraResponse = await axios.post(
      `${jiraBaseUrl}/rest/api/3/issue`,
      jiraIssueData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

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

// Fetch Jira Projects (Dynamic User Authentication)
const getJiraProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jiraBaseUrl, jiraEmail, jiraApiToken } = req.query;

    if (!jiraBaseUrl || !jiraEmail || !jiraApiToken) {
      res.status(400).json({
        success: false,
        message: "Jira Base URL, Email, and API Token are required.",
      });
      return;
    }

    const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");

    const response = await axios.get(`${jiraBaseUrl}/rest/api/3/project`, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error(
      "Error fetching Jira projects:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch Jira projects",
      error: error.response?.data || error.message,
    });
  }
};

export const JiraController = { createJiraIssue, getJiraProjects };
