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
exports.ProjectService = void 0;
const project_model_1 = require("./project.model");
const createProjectIntoDB = (project) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.ProjectModel.create(project);
    return result;
});
const getAllProjectsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.ProjectModel.find();
    return result;
});
const deleteProjectFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.ProjectModel.updateOne({ id }, { isDeleted: true });
    return result;
});
const getSingleProjectFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.ProjectModel.findOne({ id });
    return result;
});
exports.ProjectService = {
    createProjectIntoDB,
    getAllProjectsFromDB,
    getSingleProjectFromDB,
    deleteProjectFromDB,
};
