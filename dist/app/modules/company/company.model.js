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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const CompanySchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: false },
    subscription: { type: String },
    profileImageUrl: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
}, { timestamps: true });
// Pre save middleware hook
CompanySchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const company = this;
        //hashing password
        company.password = yield bcrypt_1.default.hash(company.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
//post save middleware / hooks
CompanySchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
// query middlewares
// Work on find operation (Get only isDeleted those documents where isDeleted : false )
// So that we cant get the deleted items
CompanySchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
// query middlewares
// Work on findOne operation (Get only isDeleted those documents where isDeleted : false )
// So that we cant get the deleted items
CompanySchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
// Work on aggregate
CompanySchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.CompanyModel = (0, mongoose_1.model)("Company", CompanySchema);
