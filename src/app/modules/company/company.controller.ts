import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { CompanyServices } from "./company.service";
import { CompanyValidation } from "./company.validation";

// Utility function for centralized error handling
const handleError = (
  res: Response,
  error: any,
  statusCode = 500,
  defaultMessage = "Something went wrong"
) => {
  console.error("Error:", error); // Log the error for debugging
  const message =
    error instanceof ZodError
      ? error.errors.map((e) => e.message).join(", ") // Format validation errors
      : error.message || defaultMessage;

  res.status(statusCode).json({
    success: false,
    message,
    error: error.stack || error, // Include stack trace for debugging in non-production environments
  });
};

// Controller to create a new company
const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { company: companyData } = req.body;

    // Validate input using zod schema
    const zodParseData =
      CompanyValidation.CompanyValidationSchema.parse(companyData);

    // Save company to the database
    const result = await CompanyServices.createCompanyIntoDB(zodParseData);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      handleError(res, error, 400, "Validation error");
    } else {
      handleError(res, error);
    }
  }
};

// Controller to retrieve all companies
const getAllCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await CompanyServices.getAllCompaniesFromDB();

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: "No companies found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Companies data retrieved successfully",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to retrieve a single company by ID
const getSingleCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;

    const result = await CompanyServices.getSingleComapnyFromDB(companyId);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Company retrieved successfully",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to delete a company by ID
const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;

    const result = await CompanyServices.deleteCompanyFromDB(companyId);

    if (!result.matchedCount) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to update a company's details
const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const updateData = req.body;

    // Validate the update data
    if (!updateData) {
      res.status(400).json({
        success: false,
        message: "No update data provided",
      });
      return;
    }

    const result = await CompanyServices.updateCompanyInDB(
      companyId,
      updateData
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller for company login
const loginCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find the company by email
    const company = await CompanyServices.getCompanyByEmail(email);

    if (!company || company.isDeleted) {
      res.status(404).json({
        success: false,
        message: "Invalid email or company not found",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid password",
      });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      {
        _id: company._id,
        id: company.id,
        name: company.name,
        email: company.email,
      },
      process.env.JWT_SECRET || "jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      profile: {
        _id: company._id,
        id: company.id,
        name: company.name,
        email: company.email,
        subscription: company.subscription,
        profileImageUrl: company.profileImageUrl,
        address: company.address,
        contactNumber: company.contactNumber,
      },
      role: "company",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to update a company's password
const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
      return;
    }

    const company = await CompanyServices.getSingleComapnyFromDB(companyId);

    if (!company || company.isDeleted) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      company.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // Update password
    const result = await CompanyServices.updateCompanyPasswordInDB(
      companyId,
      newPassword
    );

    if (!result) {
      res.status(500).json({
        success: false,
        message: "Failed to update password",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Export all controllers
export const CompanyControllers = {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  deleteCompany,
  updateCompany,
  loginCompany,
  updatePassword,
};
