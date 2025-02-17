import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import { CompanyRoutes } from "./app/modules/company/company.route";
import { ModuleRoutes } from "./app/modules/module/module.route";
import { ProjectRoutes } from "./app/modules/project/project.route";
import { TestCaseRoutes } from "./app/modules/test-case/testcase.route";

const app: Application = express();

// CORS middleware setup
const allowedOrigins = [
  "http://localhost:5173", // Localhost URL for development
  "https://testcraft.unidevgo.com", // Production URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Parsers
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Application routes
app.use("/api/v1/companies", CompanyRoutes);
app.use("/api/v1/projects", ProjectRoutes);
app.use("/api/v1/modules", ModuleRoutes);
app.use("/api/v1/test-case", TestCaseRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server Running");
});

export default app;
