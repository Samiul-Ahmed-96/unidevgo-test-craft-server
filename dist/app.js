"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const module_route_1 = require("./app/modules/module/module.route");
const project_route_1 = require("./app/modules/project/project.route");
const testcase_route_1 = require("./app/modules/test-case/testcase.route");
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//Application routes
app.use("/api/v1/projects", project_route_1.ProjectRoutes);
app.use("/api/v1/modules", module_route_1.ModuleRoutes);
app.use("/api/v1/test-case", testcase_route_1.TestCaseRoutes);
app.get("/", (req, res) => {
    res.send("Server Running");
});
exports.default = app;
