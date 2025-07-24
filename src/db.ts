import mongoose, { model, Schema } from "mongoose";
import { required } from "zod/v4/core/util.cjs";
mongoose.connect("");
const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
})

export const UserModel = mongoose.model("User",UserSchema);

const ContentSchema = new mongoose.Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})
export const ContentModel = mongoose.model("Content", ContentSchema);

export const LinkModel = model("Links", LinkSchema);