import express from "express";
const userPurchaseRoute = express.Router();
import { auth } from "../middleware/userAuth.middleware";
import { userPurchase } from "../validator/object.validator";
import { PurchasedModel } from "../models/db.models";
import { AppError } from "../utils/AppError.class.utils";
import { tryCatch } from "../utils/tryCatch.handler.error.utils";

const user_jwt = process.env.USER_JWT_SECRET;

userPurchaseRoute.post("/course/:courseId", auth(user_jwt), tryCatch(async (req, res, next) => {
    const parsedBody = userPurchase.safeParse({ courseId: req.params.courseId });
    if (!parsedBody.success) {
        return next(new AppError(parsedBody.error, 400)); // 400 Bad Request
    }

    const userId = req.userId;
    const courseId = parsedBody.data.courseId;

    await PurchasedModel.create({
        userId,
        courseId
    });


    return res.status(200).json({
        status: true,
        msg: "Course purchased successfully",
    });
}));

userPurchaseRoute.get("/course", auth(user_jwt), tryCatch(async (req, res, next) => {
    const userId = req.userId;
    const purchasedCourse = await PurchasedModel.find({ userId }, {
        $in: { _id: purchasedCourse.courseId }
    });

    if (!purchasedCourse || purchasedCourse.length === 0) {
        return next(new AppError("No course found", 404));
    }

    return res.status(200).json({
        status: true,
        course: purchasedCourse,
    });
}));

export { userPurchaseRoute };
