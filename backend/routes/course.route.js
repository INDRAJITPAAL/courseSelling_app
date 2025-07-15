import express from "express";
const courseRoute = express.Router();
import { courseCreate, courseUpdate } from "../validator/object.validator";
import { CourseModel, UserModel } from "../models/db.models";
const admin_jwt = process.env.ADMIN_JWT_SECRET;
import { AppError } from "../utils/AppError.class.utils.js";
import { auth } from "../middleware/userAuth.middleware";
import { tryCatch } from "../utils/tryCatch.handler.error.utils";

courseRoute.post("/create", auth(admin_jwt), tryCatch(async (req, res, next) => {
 
    const parsedBody = courseCreate.safeParse(req.body);
    if (!parsedBody.success) {
        return next(new AppError(parsedBody.error, 400));
    }
    const userId = req.userId;
    const userInfo = await UserModel.findOne({ _id: userId });
    if (userInfo.role != "admin") {
        return next(new AppError("login as admin", 403));
    }
    const { title, description, imageUrl, price } = parsedBody.data;
    const createCourse = await CourseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: userId,
    });

    if (!createCourse) {
        return next(new AppError("course not created", 500));
    }
    return res.json({
        status: true,
        message: "course created successfully",
        courseId:createCourse._id
    });
}));

courseRoute.put("/course", auth(admin_jwt), tryCatch(async (req, res, next) => {
    const parsedBody = courseUpdate.safeParse(req.body);
    if (!parsedBody.success) {
        return next(new AppError(parsedBody.error, 400));
    }
    const userId = req.userId;
    const userInfo = await UserModel.findOne({ _id: userId });
    if (userInfo.role !== "admin") {
        return next(new AppError("you're not an admin, please signup as admin", 403));
    }

    const { title, description, imageUrl, price, courseId } = parsedBody.data;
    const courseUpdateResult = await CourseModel.updateOne(
        { creatorId: userId, _id: courseId },
        { title, description, imageUrl, price }
    );

    if (courseUpdateResult.modifiedCount === 0) {
        return next(new AppError("course not updated", 404));
    }

    return res.json({
        status: true,
        message: "course updated successfully",
    });
}));

courseRoute.get("/courses", auth(admin_jwt), tryCatch(async (req, res, next) => {
    const allAdminCourse = await CourseModel.find({creatorId:req.userId});
    if (allAdminCourse.length === 0) {
        return next(new AppError("course not found", 404));
    }
    return res.json({
        status: true,
        course: allAdminCourse,
    });
}));

export {
    courseRoute
}
