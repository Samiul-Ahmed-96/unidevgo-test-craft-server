import axios from "axios";
import { Request, Response } from "express";

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const createJiraIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCase, projectKey } = req.body; // Project key comes from the client side
    if (!testCase || !projectKey) {
      res.status(400).json({
        success: false,
        message: "Test case data and project key are required",
      });
      return;
    }

    // Destructure optional default properties from the testCase object
    const {
      createdBy,
      testDescription,
      expectedResult,
      status,
      executedDate,
      updatedDate,
    } = testCase.defaultProperties || {};

    // Set default title if testDescription is not provided
    const title = testDescription || "No title provided";

    // Construct the description in ADF (Atlassian Document Format)
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

    // Helper function to format date
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    // Add additional properties to the description if available
    const addPropertyToDescription = (label: string, value: string) => {
      if (value) {
        // If the value is a date string, format it
        const formattedValue = label.includes("Date")
          ? formatDate(value)
          : value;

        adfDescription.content.push({
          type: "paragraph",
          content: [{ type: "text", text: `${label}: ${formattedValue}` }],
        });
      }
    };

    // Add the properties, formatting the dates
    addPropertyToDescription("Created By", createdBy);
    addPropertyToDescription("Expected Result", expectedResult);
    addPropertyToDescription("Status", status);
    addPropertyToDescription("Executed Date", executedDate);
    addPropertyToDescription("Updated Date", updatedDate);

    // Add custom properties if they exist
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

    // Jira issue data with the project key
    const jiraIssueData = {
      fields: {
        project: { key: projectKey },
        summary: title,
        description: adfDescription,
        issuetype: { name: "Task" },
        labels: ["Test-Craft-APP", "Test-Case"],
      },
    };

    // Basic authentication setup
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
      "base64"
    );

    // Send the request to Jira API to create an issue
    const jiraResponse = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
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

// Create a route to fetch Jira projects
const getJiraProjects = async (req: Request, res: Response) => {
  try {
    // Authentication
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
      "base64"
    );

    // Make the request to Jira API to fetch projects
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/project`, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    // Send the list of projects back to the client
    res.status(200).json({
      success: true,
      data: response.data, // You can return the list of projects
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
