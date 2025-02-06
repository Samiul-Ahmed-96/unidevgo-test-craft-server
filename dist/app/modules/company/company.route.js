"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("./company.controller");
const router = express_1.default.Router();
router.get("/", company_controller_1.CompanyControllers.getAllCompanies);
router.post("/create-company", company_controller_1.CompanyControllers.createCompany);
router.get("/:companyId", company_controller_1.CompanyControllers.getSingleCompany);
router.delete("/:companyId", company_controller_1.CompanyControllers.deleteCompany);
router.put("/:companyId", company_controller_1.CompanyControllers.updateCompany);
router.post("/login", company_controller_1.CompanyControllers.loginCompany);
router.put("/update-password/:companyId", company_controller_1.CompanyControllers.updatePassword);
exports.CompanyRoutes = router;
