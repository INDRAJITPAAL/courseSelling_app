import express from "express";
const userPurchaseRoute = express.Router();
import { auth } from "../middleware/userAuth";
import { userPurchase } from "../validator/object.validator";
import { PurchasedModel } from "../models/db.models";
const user_jwt = process.env.USER_JWT_SECRET;

userPurchaseRoute.post("/course", auth(user_jwt), async (req, res) => {
    const parsedBody = userPurchase.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(404).json({
            status: false,
            error: parsedBody.error,
        })

    }
    const userId = req.userId;
    const courseId = parsedBody.data;
    //first we have to set payment method here
    const purchasedCourse = await PurchasedModel.create({
        userId,
        courseId
    });
    if (!purchasedCourse) {
        return res.json(500).json({
            status: false,
            msg: "course purchase fail",
        })
    }

    return res.json(200).json({
        status: true,
        msg: "course purchase fail",
    })


});

userPurchaseRoute.get("/course/purchased", auth(user_jwt), async (req, res) => {
    const userId = req.userId;
    //first we have to set payment method here
    const purchasedCourse = await PurchasedModel.find({
        userId
    });
    if (purchasedCourse.length === 0) {
        return res.json(500).json({
            status: false,
            msg: "No Course Found",
        })
    }

    return res.json(200).json({
        status: true,
        curser: purchasedCourse.populate("courseId"),
    })


});


export default { userPurchaseRoute };