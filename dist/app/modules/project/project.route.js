"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("./project.controller");
const router = express_1.default.Router();
router.get("/", project_controller_1.ProjectControllers.getAllProjects);
// Fetch all projects under a company (requires companyId as query param)
router.get("/company", project_controller_1.ProjectControllers.getAllProjectByCompany);
router.put("/:projectId", project_controller_1.ProjectControllers.updateProject);
router.get("/:projectId", project_controller_1.ProjectControllers.getSingleProject);
router.post("/create-project", project_controller_1.ProjectControllers.createProject);
router.delete("/:projectId", project_controller_1.ProjectControllers.deleteProject);
exports.ProjectRoutes = router;
