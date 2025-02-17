"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const company_route_1 = require("./app/modules/company/company.route");
const module_route_1 = require("./app/modules/module/module.route");
const project_route_1 = require("./app/modules/project/project.route");
const testcase_route_1 = require("./app/modules/test-case/testcase.route");
const app = (0, express_1.default)();
// CORS middleware setup
const allowedOrigins = [
    "http://localhost:5173", // Localhost URL for development
    "https://testcraft.unidevgo.com", // Production URL
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
// Parsers
app.use(express_1.default.json());
// Serve uploaded files statically
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// Application routes
app.use("/api/v1/companies", company_route_1.CompanyRoutes);
app.use("/api/v1/projects", project_route_1.ProjectRoutes);
app.use("/api/v1/modules", module_route_1.ModuleRoutes);
app.use("/api/v1/test-case", testcase_route_1.TestCaseRoutes);
app.get("/", (req, res) => {
    res.send("Server Running");
});
exports.default = app;
