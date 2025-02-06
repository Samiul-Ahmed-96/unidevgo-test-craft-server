import { TProject } from "./project.interface";
import { ProjectModel } from "./project.model";

const createProjectIntoDB = async (project: TProject) => {
  const result = await ProjectModel.create(project);
  return result;
};

const getAllProjectsFromDB = async () => {
  const result = await ProjectModel.find();
  return result;
};

// Fetch all modules under a project
const getAllModulesByCompanyFromDB = async (companyId: string) => {
  return await ProjectModel.find({ companyId });
};

const deleteProjectFromDB = async (id: string) => {
  const result = await ProjectModel.updateOne({ id }, { isDeleted: true });
  return result;
};

const getSingleProjectFromDB = async (id: string) => {
  const result = await ProjectModel.findOne({ id });
  return result;
};

export const ProjectService = {
  createProjectIntoDB,
  getAllProjectsFromDB,
  getAllModulesByCompanyFromDB,
  getSingleProjectFromDB,
  deleteProjectFromDB,
};
