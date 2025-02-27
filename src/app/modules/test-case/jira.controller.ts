import axios from "axios";
import { Request, Response } from "express";
import FormData from "form-data";
import { JSDOM } from "jsdom";

const createJiraIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testCase, projectKey, jiraBaseUrl, jiraEmail, jiraApiToken } =
      req.body;

    // Validate required fields
    if (
      !testCase ||
      !projectKey ||
      !jiraBaseUrl ||
      !jiraEmail ||
      !jiraApiToken
    ) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
      return;
    }

    // Extract default properties from the test case
    const {
      createdBy,
      testDescription,
      expectedResult,
      actualResult,
      status,
      executedDate,
      updatedDate,
    } = testCase.defaultProperties || {};
    const title = testDescription || "No title provided";

    // Convert steps (rich text) to ADF format
    const stepsProperty = testCase.customProperties?.find(
      (prop: any) => prop.name === "steps"
    );
    let stepsContent: any[] = [];

    if (stepsProperty && stepsProperty.type === "richText") {
      try {
        const dom = new JSDOM(stepsProperty.value);
        const body = dom.window.document.body;

        // Helper function to convert HTML nodes to ADF format
        const convertNodeToADF = (node: Node): any => {
          if (!node) return null;

          switch (node.nodeName.toLowerCase()) {
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
              return {
                type: "heading",
                attrs: { level: parseInt(node.nodeName.substring(1)) },
                content: [{ type: "text", text: node.textContent || "" }],
              };

            case "p":
              return {
                type: "paragraph",
                content: [{ type: "text", text: node.textContent || "" }],
              };

            case "ul":
              return {
                type: "bulletList",
                content: Array.from(node.childNodes)
                  .filter((child) => child.nodeName.toLowerCase() === "li")
                  .map((li) => ({
                    type: "listItem",
                    content: [convertNodeToADF(li)].filter(Boolean),
                  })),
              };

            case "ol":
              return {
                type: "orderedList",
                content: Array.from(node.childNodes)
                  .filter((child) => child.nodeName.toLowerCase() === "li")
                  .map((li) => ({
                    type: "listItem",
                    content: [convertNodeToADF(li)].filter(Boolean),
                  })),
              };

            case "li":
              return {
                type: "paragraph",
                content: [{ type: "text", text: node.textContent || "" }],
              };

            case "strong":
            case "b":
              return {
                type: "text",
                text: node.textContent || "",
                marks: [{ type: "strong" }],
              };

            case "em":
            case "i":
              return {
                type: "text",
                text: node.textContent || "",
                marks: [{ type: "em" }],
              };

            case "a":
              return {
                type: "text",
                text: node.textContent || "",
                marks: [
                  {
                    type: "link",
                    attrs: {
                      href: (node as Element).getAttribute("href") || "",
                    },
                  },
                ],
              };

            case "#text":
              return node.textContent?.trim()
                ? {
                    type: "text",
                    text: node.textContent,
                  }
                : null;

            default:
              return null;
          }
        };

        // Convert all child nodes of the body to ADF format
        stepsContent = Array.from(body.childNodes)
          .map((node) => convertNodeToADF(node))
          .filter((node) => node !== null); // Filter out unsupported nodes

        // Add a heading for "Steps To Reproduce" if there is any content
        if (stepsContent.length > 0) {
          stepsContent.unshift({
            type: "heading",
            attrs: { level: 3 },
            content: [{ type: "text", text: "Steps To Reproduce" }],
          });
        }
      } catch (error) {
        console.error("Error parsing rich text:", error);
        stepsContent = []; // Fallback to empty steps if parsing fails
      }
    }

    // Find attachment URL
    const attachmentProperty = testCase.customProperties?.find(
      (prop: any) => prop.type === "attachment"
    );
    const attachmentUrl = attachmentProperty ? attachmentProperty.value : null;

    // Construct ADF description
    const adfDescription = {
      type: "doc",
      version: 1,
      content: [
        ...stepsContent,
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `Actual Result: ${actualResult || "N/A"}`,
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `Expected Result: ${expectedResult || "N/A"}`,
            },
          ],
        },
        ...(attachmentUrl
          ? [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Attachment: ",
                    marks: [{ type: "strong" }],
                  },
                  {
                    type: "text",
                    text: "Click here to view",
                    marks: [{ type: "link", attrs: { href: attachmentUrl } }],
                  },
                ],
              },
            ]
          : []),
      ],
    };

    // Construct Jira issue payload
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

    // Create Jira issue
    const jiraResponse = await axios.post(
      `${jiraBaseUrl}/rest/api/3/issue`,
      jiraIssueData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const issueId = jiraResponse.data.id;
    console.log(`Issue created successfully: ${issueId}`);

    // Upload attachment (if exists)
    if (attachmentUrl) {
      try {
        console.log(`Uploading attachment: ${attachmentUrl}`);

        const formData = new FormData();
        const attachmentResponse = await axios.get(attachmentUrl, {
          responseType: "arraybuffer",
        });

        // Extract filename & extension
        const fileExtension = attachmentUrl.split(".").pop(); // Get file extension
        const fileName = `attachment.${fileExtension}`; // Keep original extension

        formData.append("file", attachmentResponse.data, fileName);

        await axios.post(
          `${jiraBaseUrl}/rest/api/3/issue/${issueId}/attachments`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Basic ${auth}`,
              "X-Atlassian-Token": "no-check",
            },
          }
        );

        console.log(`Attachment uploaded successfully: ${fileName}`);
      } catch (error) {
        console.error("Error uploading attachment:", error);
      }
    }

    res.status(201).json({
      success: true,
      message: "Jira Issue Created successfully",
      issueId,
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
const getJiraProjects = async (req: Request, res: Response) => {
  try {
    const { jiraBaseUrl, jiraEmail, jiraApiToken } = req.query;

    if (!jiraBaseUrl || !jiraEmail || !jiraApiToken) {
      return res.status(400).json({
        success: false,
        message: "Jira Base URL, Email, and API Token are required.",
      });
    }

    const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");

    const response = await axios.get(`${jiraBaseUrl}/rest/api/3/project`, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error(
      "Error fetching Jira projects:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Jira projects",
      error: error.response?.data || error.message,
    });
  }
};

const fetchJiraFields = async (req: Request, res: Response) => {
  try {
    const { jiraBaseUrl, jiraEmail, jiraApiToken } = req.query;

    if (!jiraBaseUrl || !jiraEmail || !jiraApiToken) {
      return res.status(400).json({
        success: false,
        message: "Jira Base URL, Email, and API Token are required.",
      });
    }

    const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");

    const response = await axios.get(`${jiraBaseUrl}/rest/api/3/field`, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error(
      "Error fetching Jira fields:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Jira fields",
      error: error.response?.data || error.message,
    });
  }
};

export const JiraController = {
  createJiraIssue,
  getJiraProjects,
  fetchJiraFields,
};
