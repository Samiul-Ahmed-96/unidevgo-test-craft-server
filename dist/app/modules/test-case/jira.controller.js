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
// Jira Issue Creation
const createJiraIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { testCase, projectKey, jiraBaseUrl, jiraEmail, jiraApiToken } = req.body;
        if (!testCase ||
            !projectKey ||
            !jiraBaseUrl ||
            !jiraEmail ||
            !jiraApiToken) {
            res.status(400).json({
                success: false,
                message: "Test case data, project key, Jira Base URL, Email, and API token are required.",
            });
            return;
        }
        const { createdBy, testDescription, expectedResult, status, executedDate, updatedDate, } = testCase.defaultProperties || {};
        const title = testDescription || "No title provided";
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
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return (date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }) +
                " " +
                date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        };
        const addPropertyToDescription = (label, value) => {
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
        const jiraResponse = yield axios_1.default.post(`${jiraBaseUrl}/rest/api/3/issue`, jiraIssueData, {
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
