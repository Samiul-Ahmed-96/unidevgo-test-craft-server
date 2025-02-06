import cors from "cors";
import express, { Application, Request, Response } from "express";
import { CompanyRoutes } from "./app/modules/company/company.route";
import { ModuleRoutes } from "./app/modules/module/module.route";
import { ProjectRoutes } from "./app/modules/project/project.route";
import { TestCaseRoutes } from "./app/modules/test-case/testcase.route";
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//Application routes
app.use("/api/v1/companies", CompanyRoutes);
app.use("/api/v1/projects", ProjectRoutes);
app.use("/api/v1/modules", ModuleRoutes);
app.use("/api/v1/test-case", TestCaseRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("UnidevGO Test Craft Server Running");
});

export default app;
