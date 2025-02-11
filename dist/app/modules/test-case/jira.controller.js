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
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const createJiraIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        const { createdBy, testDescription, expectedResult, status, executedDate, updatedDate, } = testCase.defaultProperties || {};
        // Set default title if testDescription is not provided
        const title = testDescription || "No title provided";
        // Construct the description in ADF (Atlassian Document Format)
        const adfDescription = {
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
        // Add additional properties to the description if available
        const addPropertyToDescription = (label, value) => {
            if (value) {
                adfDescription.content.push({
                    type: "paragraph",
                    content: [{ type: "text", text: `${label}: ${value}` }],
                });
            }
        };
        addPropertyToDescription("Created By", createdBy);
        addPropertyToDescription("Expected Result", expectedResult);
        addPropertyToDescription("Status", status);
        addPropertyToDescription("Executed Date", executedDate);
        addPropertyToDescription("Updated Date", updatedDate);
        // Add custom properties if they exist
        if (testCase.customProperties && testCase.customProperties.length > 0) {
            testCase.customProperties.forEach((property) => {
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
        const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
        // Send the request to Jira API to create an issue
        const jiraResponse = yield axios_1.default.post(`${JIRA_BASE_URL}/rest/api/3/issue`, jiraIssueData, {
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
    }
    catch (error) {
        console.error("Error creating Jira issue:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(400).json({
            success: false,
            message: "Failed to create Jira Issue",
            error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
        });
    }
});
// Create a route to fetch Jira projects
const getJiraProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Authentication
        const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
        // Make the request to Jira API to fetch projects
        const response = yield axios_1.default.get(`${JIRA_BASE_URL}/rest/api/3/project`, {
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
    }
    catch (error) {
        console.error("Error fetching Jira projects:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch Jira projects",
            error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
        });
    }
});
exports.JiraController = { createJiraIssue, getJiraProjects };
