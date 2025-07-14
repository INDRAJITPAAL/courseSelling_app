import express from "express";
const courseRoute = express.Router();
const admin_jwt = process.env.ADMIN_JWT_SECRET;
import { courseCreate, courseUpdate } from "../validator/object.validator";
import { CourseModel, UserModel } from "../models/db.models";
const user_jwt = process.env.USER_JWT_SECRET;


courseRoute.post("/create", auth(admin_jwt), async (req, res) => {
    const parsedBody = courseCreate.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(404).json({
            status: false,
            error: parsedBody.error,
        });
    }

    const userId = req.userId;
    const userInfo = await UserModel.findOne({ _id: userId });
    if (!userInfo.role === "admin") {
        return res.json({
            status: false,
            error: "you'r not an admin please signup as admin"
        })
    }
    const { title, description, imageUrl, price } = parsedBody.data;
    const createCourse = await CourseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: userId,
    })

    if (!createCourse) {
        return res.json({
            status: false,
            error: "course not created",
        })
    }
    return res.json({
        status: true,
        error: "course  created succefull",
    })


})

courseRoute.put("/course", async (req, res) => {

    const parsedBody = courseUpdate.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(404).json({
            status: false,
            error: parsedBody.error,
        });
    }
    const userId = req.userId;
    const userInfo = await UserModel.findOne({ _id: userId });
    if (!userInfo.role === "admin") {
        return res.json({
            status: false,
            error: "you'r not an admin please signup as admin"
        })
    }

    const { title, description, imageUrl, price, courseId } = parsedBody.data;
    const courserUpdate = await CourseModel.updateOne({ creatorId: userId, _id: courseId }, {
        title, description, imageUrl, price
    })

})


courseRoute.get("/course/bulk", auth(user_jwt), async (req, res) => {
    const userId = req.userId;
    const allCourse = await CourseModel.find({});
    if (allCourse.length === 0) {
        return res.status(404).json({
            status: false,
            error: "course not found",
        })
    }
    return res.json({
        status: true,
        course: allCourse,
    })
})




export default {
    courseRoute
}