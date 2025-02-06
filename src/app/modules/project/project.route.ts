import express from "express";
import { ProjectControllers } from "./project.controller";

const router = express.Router();

router.get("/", ProjectControllers.getAllProjects);
// Fetch all projects under a company (requires companyId as query param)
router.get("/company", ProjectControllers.getAllProjectByCompany);
router.get("/:projectId", ProjectControllers.getSingleProject);
router.post("/create-project", ProjectControllers.createProject);
router.delete("/:projectId", ProjectControllers.deleteProject);

export const ProjectRoutes = router;
