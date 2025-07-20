"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("")
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    password: String,
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
const ContentSchema = new mongoose_1.default.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }
});
exports.ContentModel = mongoose_1.default.model("Content", ContentSchema);
