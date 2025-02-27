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
exports.JiraController = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const jsdom_1 = require("jsdom");
const createJiraIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { testCase, projectKey, jiraBaseUrl, jiraEmail, jiraApiToken } = req.body;
        // Validate required fields
        if (!testCase ||
            !projectKey ||
            !jiraBaseUrl ||
            !jiraEmail ||
            !jiraApiToken) {
            res
                .status(400)
                .json({ success: false, message: "Missing required fields." });
            return;
        }
        // Extract default properties from the test case
        const { createdBy, testDescription, expectedResult, actualResult, status, executedDate, updatedDate, } = testCase.defaultProperties || {};
        const title = testDescription || "No title provided";
        // Convert steps (rich text) to ADF format
        const stepsProperty = (_a = testCase.customProperties) === null || _a === void 0 ? void 0 : _a.find((prop) => prop.name === "steps");
        let stepsContent = [];
        if (stepsProperty && stepsProperty.type === "richText") {
            try {
                const dom = new jsdom_1.JSDOM(stepsProperty.value);
                const body = dom.window.document.body;
                // Helper function to convert HTML nodes to ADF format
                const convertNodeToADF = (node) => {
                    var _a;
                    if (!node)
                        return null;
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
                                            href: node.getAttribute("href") || "",
                                        },
                                    },
                                ],
                            };
                        case "#text":
                            return ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim())
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
            }
            catch (error) {
                console.error("Error parsing rich text:", error);
                stepsContent = []; // Fallback to empty steps if parsing fails
            }
        }
        // Find attachment URL
        const attachmentProperty = (_b = testCase.customProperties) === null || _b === void 0 ? void 0 : _b.find((prop) => prop.type === "attachment");
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
        const jiraResponse = yield axios_1.default.post(`${jiraBaseUrl}/rest/api/3/issue`, jiraIssueData, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const issueId = jiraResponse.data.id;
        console.log(`Issue created successfully: ${issueId}`);
        // Upload attachment (if exists)
        if (attachmentUrl) {
            try {
                console.log(`Uploading attachment: ${attachmentUrl}`);
                const formData = new form_data_1.default();
                const attachmentResponse = yield axios_1.default.get(attachmentUrl, {
                    responseType: "arraybuffer",
                });
                // Extract filename & extension
                const fileExtension = attachmentUrl.split(".").pop(); // Get file extension
                const fileName = `attachment.${fileExtension}`; // Keep original extension
                formData.append("file", attachmentResponse.data, fileName);
                yield axios_1.default.post(`${jiraBaseUrl}/rest/api/3/issue/${issueId}/attachments`, formData, {
                    headers: Object.assign(Object.assign({}, formData.getHeaders()), { Authorization: `Basic ${auth}`, "X-Atlassian-Token": "no-check" }),
                });
                console.log(`Attachment uploaded successfully: ${fileName}`);
            }
            catch (error) {
                console.error("Error uploading attachment:", error);
            }
        }
        res.status(201).json({
            success: true,
            message: "Jira Issue Created successfully",
            issueId,
        });
    }
    catch (error) {
        console.error("Error creating Jira issue:", ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
        res.status(400).json({
            success: false,
            message: "Failed to create Jira Issue",
            error: ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message,
        });
    }
});
// Fetch Jira Projects (Dynamic User Authentication)
const getJiraProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { jiraBaseUrl, jiraEmail, jiraApiToken } = req.query;
        if (!jiraBaseUrl || !jiraEmail || !jiraApiToken) {
            return res.status(400).json({
                success: false,
                message: "Jira Base URL, Email, and API Token are required.",
            });
        }
        const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");
        const response = yield axios_1.default.get(`${jiraBaseUrl}/rest/api/3/project`, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });
        return res.status(200).json({
            success: true,
            data: response.data,
        });
    }
    catch (error) {
        console.error("Error fetching Jira projects:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Jira projects",
            error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
        });
    }
});
const fetchJiraFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { jiraBaseUrl, jiraEmail, jiraApiToken } = req.query;
        if (!jiraBaseUrl || !jiraEmail || !jiraApiToken) {
            return res.status(400).json({
                success: false,
                message: "Jira Base URL, Email, and API Token are required.",
            });
        }
        const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");
        const response = yield axios_1.default.get(`${jiraBaseUrl}/rest/api/3/field`, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });
        return res.status(200).json({
            success: true,
            data: response.data,
        });
    }
    catch (error) {
        console.error("Error fetching Jira fields:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Jira fields",
            error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
        });
    }
});
exports.JiraController = {
    createJiraIssue,
    getJiraProjects,
    fetchJiraFields,
};
