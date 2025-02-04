import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { projectValidation } from "./project.validation";

// Controller to create a new project
const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { project: projectData } = req.body;

    // Validate input using zod schema
    const zodParseData =
      projectValidation.ProjectValidationSchema.parse(projectData);

    // Create the project in the database
    const result = await ProjectService.createProjectIntoDB(zodParseData);

    res.status(201).json({
      success: true,
      message: "Project Added successfully",
      data: result,
    });
  } catch (error) {
    res.send(error);
  }
};

// Controller to retrieve all projects
const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await ProjectService.getAllProjectsFromDB();

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
  } catch (error) {
    res.send(error);
  }
};

// Controller to delete an project by ID
const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const result = await ProjectService.deleteProjectFromDB(projectId);

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
  } catch (error) {
    res.send(error);
  }
};

// Controller to retrieve a single project by ID
const getSingleProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const result = await ProjectService.getSingleProjectFromDB(projectId);

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
  } catch (error) {
    res.send(error);
  }
};

// Export all controllers
export const ProjectControllers = {
  createProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
};
