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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("./db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const middleware_1 = require("./middleware");
const JWT_SECRET = "123123";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requirebody = zod_1.z.object({
        username: zod_1.z.string().min(3).max(55),
        password: zod_1.z.string().min(5).max(25)
    });
    const parseddatawithsuccess = requirebody.safeParse(req.body);
    if (!parseddatawithsuccess.success) {
        res.json({
            message: "incorrect format of data entered",
            error: parseddatawithsuccess.error
        });
        return;
    }
    const username = req.body.username;
    const password = req.body.password;
    try {
        const hashpassword = yield bcryptjs_1.default.hash(password, 5);
        console.log(hashpassword);
        yield db_1.UserModel.create({
            username: username,
            password: hashpassword
        });
        res.json({
            message: "User signed up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User already exists"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const userexists = yield db_1.UserModel.findOne({
        username: username
    });
    if (!userexists || !userexists.password) {
        return res.status(403).json({
            message: "User does not exist in DB or has no password",
        });
    }
    const passmatch = yield bcryptjs_1.default.compare(password, userexists.password);
    if (passmatch) {
        const token = jsonwebtoken_1.default.sign({ id: userexists._id.toString() }, JWT_SECRET);
        res.json({ token });
    }
    else {
        res.status(403).json({ message: "you can't sign in" });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    yield db_1.ContentModel.create({
        link, type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "content added"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
app.delete("/api/v1/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: userId
    });
    res.json({
        message: "content deleted"
    });
}));
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
