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
exports.ModuleControllers = void 0;
const module_service_1 = require("./module.service");
const module_validaiton_1 = require("./module.validaiton");
// Create Module
const createModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moduleData = module_validaiton_1.moduleValidation.ModuleValidationSchema.parse(req.body);
        const result = yield module_service_1.ModuleService.createModuleIntoDB(moduleData);
        res.status(201).json({
            success: true,
            message: "Module added sucessfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, error });
    }
});
// Add Submodule
const addSubmodule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parentId = req.params.parentId;
        const submoduleData = module_validaiton_1.moduleValidation.ModuleValidationSchema.parse(req.body);
        const result = yield module_service_1.ModuleService.addSubmoduleToModule(parentId, submoduleData);
        res.status(201).json({
            success: true,
            message: "Submodule added sucessfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, error });
    }
});
// Controller to fetch all modules under a project
const getAllModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.query;
        if (!projectId || typeof projectId !== "string") {
            res.status(400).json({
                success: false,
                message: "Invalid or missing projectId",
            });
            return;
        }
        const result = yield module_service_1.ModuleService.getAllModulesFromDB(projectId);
        res.status(200).json({
            success: true,
            message: "Modules retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
// Controller to fetch a single module
const getSingleModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId } = req.params;
        if (!moduleId) {
            res.status(400).json({
                success: false,
                message: "Module ID is required",
            });
            return;
        }
        const result = yield module_service_1.ModuleService.getSingleModuleFromDB(moduleId);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Module not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Module retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
// Controller to delete (soft delete) a module
const deleteModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId } = req.params;
        if (!moduleId) {
            res.status(400).json({
                success: false,
                message: "Module ID is required",
            });
            return;
        }
        const result = yield module_service_1.ModuleService.deleteModuleFromDB(moduleId);
        if (result.matchedCount === 0) {
            res.status(404).json({
                success: false,
                message: "Module not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Module deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.ModuleControllers = {
    createModule,
    addSubmodule,
    getAllModules,
    getSingleModule,
    deleteModule,
};
