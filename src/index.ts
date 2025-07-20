import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {z} from "zod";
import { ContentModel, UserModel, LinkModel } from "./db";
import bcrypt from "bcryptjs"
import { userMiddleware } from "./middleware";
const JWT_SECRET = "123123";
const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req,res)=>{
    const requirebody = z.object({
        username: z.string().min(3).max(55),
        password: z.string().min(5).max(25)
    })
    const parseddatawithsuccess = requirebody.safeParse(req.body);
    if(!parseddatawithsuccess.success){
        res.json({
            message: "incorrect format of data entered",
            error: parseddatawithsuccess.error
        })
        return 
    }
    const username = req.body.username
    const password = req.body.password
    try{
        const hashpassword= await bcrypt.hash(password , 5)
        console.log(hashpassword);
        await UserModel.create({
        username: username,
        password: hashpassword
    })
    res.json({
        message: "User signed up"
    })
    } catch(e){
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post("/api/v1/signin", async (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const userexists = await UserModel.findOne({
     username: username
    });
    if (!userexists || !userexists.password) {
    return res.status(403).json({
      message: "User does not exist in DB or has no password",
    });
}
    const passmatch = await bcrypt.compare(password,userexists.password);
    if (passmatch) {
    const token = jwt.sign({ id: userexists._id.toString() }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(403).json({ message: "you can't sign in" });
  }
})
app.post("/api/v1/content",userMiddleware, async (req,res)=>{
    const link = req.body.link
    const type = req.body.type;
    await ContentModel.create({
        link,type,
        title: req.body.title,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })
    res.json({
        message: "content added"
    })
})
app.get("/api/v1/content",userMiddleware, async(req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    })
})
app.delete("/api/v1/content", async (req,res)=>{
    const contentId = req.body.contentId
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: userId
    })
    res.json({
        message: "content deleted"
    })
})
app.post("/api/v1/brain/share", async (req,res)=>{
    const share = req.body.share;
    if (share) {
            const existingLink = await LinkModel.findOne({
                //@ts-ignore
                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            //@ts-ignore
            const hash = random(10);
            await LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            })

            res.json({
                hash
            })
    } else {
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})
app.get("/api/v1/brain/:shareLink", (req,res)=>{

})
app.listen(3000);