import express from "express";
import { ModuleControllers } from "./module.controller";

const router = express.Router();
// Create Module
router.post("/", ModuleControllers.createModule);

// Create Sub Module
router.post("/:parentId/submodule", ModuleControllers.addSubmodule);

// Fetch all modules under a project (requires projectId as query param)
router.get("/", ModuleControllers.getAllModules);

// Fetch a single module by moduleId
router.get("/:moduleId", ModuleControllers.getSingleModule);

// Soft delete a module by moduleId
router.delete("/:moduleId", ModuleControllers.deleteModule);

export const ModuleRoutes = router;
