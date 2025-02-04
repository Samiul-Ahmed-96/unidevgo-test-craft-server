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
  getSingleProjectFromDB,
  deleteProjectFromDB,
};
