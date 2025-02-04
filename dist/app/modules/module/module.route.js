"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const module_controller_1 = require("./module.controller");
const router = express_1.default.Router();
// Create Module
router.post("/", module_controller_1.ModuleControllers.createModule);
// Create Sub Module
router.post("/:parentId/submodule", module_controller_1.ModuleControllers.addSubmodule);
// Fetch all modules under a project (requires projectId as query param)
router.get("/", module_controller_1.ModuleControllers.getAllModules);
// Fetch a single module by moduleId
router.get("/:moduleId", module_controller_1.ModuleControllers.getSingleModule);
// Soft delete a module by moduleId
router.delete("/:moduleId", module_controller_1.ModuleControllers.deleteModule);
exports.ModuleRoutes = router;
