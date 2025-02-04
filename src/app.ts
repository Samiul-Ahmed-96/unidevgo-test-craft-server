import cors from "cors";
import express, { Application, Request, Response } from "express";
import { ModuleRoutes } from "./app/modules/module/module.route";
import { ProjectRoutes } from "./app/modules/project/project.route";
import { TestCaseRoutes } from "./app/modules/test-case/testcase.route";
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//Application routes
app.use("/api/v1/projects", ProjectRoutes);
app.use("/api/v1/modules", ModuleRoutes);
app.use("/api/v1/test-case", TestCaseRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server Running");
});

export default app;
