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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectControllers = void 0;
const project_service_1 = require("./project.service");
const project_validation_1 = require("./project.validation");
// Controller to create a new project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project: projectData } = req.body;
        // Validate input using zod schema
        const zodParseData = project_validation_1.projectValidation.ProjectValidationSchema.parse(projectData);
        // Create the project in the database
        const result = yield project_service_1.ProjectService.createProjectIntoDB(zodParseData);
        res.status(201).json({
            success: true,
            message: "Project Added successfully",
            data: result,
        });
    }
    catch (error) {
        res.send(error);
    }
});
// Controller to retrieve all projects
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectService.getAllProjectsFromDB();
        if (result.length === 0) {
            res.status(404).json({
                success: false,
                message: "No project found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Projects data retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.send(error);
    }
});
// Controller to fetch all modules under a project
const getAllProjectByCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.query;
        if (!companyId || typeof companyId !== "string") {
            res.status(400).json({
                success: false,
                message: "Invalid or missing company id",
            });
            return;
        }
        const result = yield project_service_1.ProjectService.getAllModulesByCompanyFromDB(companyId);
        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
// Controller to delete an project by ID
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const result = yield project_service_1.ProjectService.deleteProjectFromDB(projectId);
        if (result.matchedCount === 0) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.send(error);
    }
});
// Controller to retrieve a single project by ID
const getSingleProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const result = yield project_service_1.ProjectService.getSingleProjectFromDB(projectId);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.send(error);
    }
});
// Controller to update an project's details
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const updateData = req.body;
        // Check if update data is provided
        if (!updateData) {
            res.status(400).json({
                success: false,
                message: "No update data provided",
            });
            return;
        }
        const result = yield project_service_1.ProjectService.updateProjectInDB(projectId, updateData);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.send(error);
    }
});
// Export all controllers
exports.ProjectControllers = {
    createProject,
    getAllProjects,
    getSingleProject,
    getAllProjectByCompany,
    updateProject,
    deleteProject,
};
