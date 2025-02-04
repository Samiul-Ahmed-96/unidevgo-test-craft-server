import { TModule } from "./module.interface";
import { ModuleModel } from "./module.model";

// Create a new module
const createModuleIntoDB = async (moduleData: TModule) => {
  return await ModuleModel.create(moduleData);
};

// Add a submodule
const addSubmoduleToModule = async (parentId: string, submodule: TModule) => {
  const createdSubmodule = await ModuleModel.create(submodule);
  await ModuleModel.updateOne(
    { id: parentId },
    { $push: { children: createdSubmodule.id } }
  );
  return createdSubmodule;
};

// Fetch all modules under a project
const getAllModulesFromDB = async (projectId: string) => {
  return await ModuleModel.find({ projectId });
};

// Fetch a single module
const getSingleModuleFromDB = async (id: string) => {
  return await ModuleModel.findOne({ id });
};

// Soft delete a module
const deleteModuleFromDB = async (id: string) => {
  return await ModuleModel.updateOne({ id }, { isDeleted: true });
};

export const ModuleService = {
  createModuleIntoDB,
  addSubmoduleToModule,
  getAllModulesFromDB,
  getSingleModuleFromDB,
  deleteModuleFromDB,
};
