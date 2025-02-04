import { Request, Response } from "express";
import { ModuleService } from "./module.service";
import { moduleValidation } from "./module.validaiton";

// Create Module
const createModule = async (req: Request, res: Response) => {
  try {
    const moduleData = moduleValidation.ModuleValidationSchema.parse(req.body);
    const result = await ModuleService.createModuleIntoDB(moduleData);
    res.status(201).json({
      success: true,
      message: "Module added sucessfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

// Add Submodule
const addSubmodule = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.parentId;
    const submoduleData = moduleValidation.ModuleValidationSchema.parse(
      req.body
    );
    const result = await ModuleService.addSubmoduleToModule(
      parentId,
      submoduleData
    );
    res.status(201).json({
      success: true,
      message: "Submodule added sucessfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

// Controller to fetch all modules under a project
const getAllModules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.query;

    if (!projectId || typeof projectId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid or missing projectId",
      });
      return;
    }

    const result = await ModuleService.getAllModulesFromDB(projectId);

    res.status(200).json({
      success: true,
      message: "Modules retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Controller to fetch a single module
const getSingleModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;

    if (!moduleId) {
      res.status(400).json({
        success: false,
        message: "Module ID is required",
      });
      return;
    }

    const result = await ModuleService.getSingleModuleFromDB(moduleId);

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
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Controller to delete (soft delete) a module
const deleteModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;

    if (!moduleId) {
      res.status(400).json({
        success: false,
        message: "Module ID is required",
      });
      return;
    }

    const result = await ModuleService.deleteModuleFromDB(moduleId);

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
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const ModuleControllers = {
  createModule,
  addSubmodule,
  getAllModules,
  getSingleModule,
  deleteModule,
};
