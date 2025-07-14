import express from "express";
const courseRoute = express.Router();
const admin_jwt = process.env.ADMIN_JWT_SECRET;
import { courseCreate } from "../validator/object.validator";
import { CourseModel } from "../models/db.models";

courseRoute.post("/create", auth(admin_jwt), async (req, res) => {
    const parsedBody = courseCreate.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(404).json({
            status: false,
            error: parsedBody.error,
        });
    }

    const userId = req.userId;
    const { title, description, imnageUrl, price } = parsedBody.data;
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





export default {
    courseRoute
}