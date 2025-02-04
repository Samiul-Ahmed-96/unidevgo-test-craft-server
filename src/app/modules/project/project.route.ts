import express from "express";
import { ProjectControllers } from "./project.controller";

const router = express.Router();

router.get("/", ProjectControllers.getAllProjects);
router.get("/:projectId", ProjectControllers.getSingleProject);
router.post("/create-project", ProjectControllers.createProject);
router.delete("/:projectId", ProjectControllers.deleteProject);

export const ProjectRoutes = router;
