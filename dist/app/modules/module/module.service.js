"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleService = void 0;
const module_model_1 = require("./module.model");
// Create a new module
const createModuleIntoDB = (moduleData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield module_model_1.ModuleModel.create(moduleData);
});
// Add a submodule
const addSubmoduleToModule = (parentId, submodule) => __awaiter(void 0, void 0, void 0, function* () {
    const createdSubmodule = yield module_model_1.ModuleModel.create(submodule);
    yield module_model_1.ModuleModel.updateOne({ id: parentId }, { $push: { children: createdSubmodule.id } });
    return createdSubmodule;
});
// Fetch all modules under a project
const getAllModulesFromDB = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield module_model_1.ModuleModel.find({ projectId });
});
// Fetch a single module
const getSingleModuleFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield module_model_1.ModuleModel.findOne({ id });
});
// Soft delete a module
const deleteModuleFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield module_model_1.ModuleModel.updateOne({ id }, { isDeleted: true });
});
exports.ModuleService = {
    createModuleIntoDB,
    addSubmoduleToModule,
    getAllModulesFromDB,
    getSingleModuleFromDB,
    deleteModuleFromDB,
};
