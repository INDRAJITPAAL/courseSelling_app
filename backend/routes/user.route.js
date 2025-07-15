import express from "express";
import { signupBody, signinBody } from "../validator/object.validator.js";
import { CourseModel, UserModel } from "../models/db.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tryCatch } from "../utils/tryCatch.handler.error.utils.js";
import { AppError } from "../utils/AppError.class.utils.js";

const userRoute = express.Router();

// ----------- SIGNUP ----------
userRoute.post("/signup", tryCatch(async (req, res, next) => {
    const parsedBody = signupBody.safeParse(req.body);
    console.log(parsedBody);
    if (!parsedBody.success) {
        return next(new AppError(parsedBody.error[0], 400));
    }
    const { userName, email, password, role } = parsedBody.data;
    const existingUser = await UserModel.findOne({ email }).select("-password");

    if (existingUser) {
        return next(new AppError("Email already in use!", 409));
    }

    const hashedPass = await bcrypt.hash(password, 8);
    const newUser = await UserModel.create({
        userName,
        email,
        password: hashedPass,
        role,
    });

    const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        role === "user" ? process.env.USER_JWT_SECRET : process.env.ADMIN_JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(201).json({
        status: true,
        token,
        msg: "User signed up successfully",
    });
}));

// ----------- SIGNIN ----------
userRoute.post("/signin", tryCatch(async (req, res, next) => {
    const parsedBody = signinBody.safeParse(req.body);
    if (!parsedBody.success) {
        return next(new AppError(parsedBody.error.format(), 400));
    }

    const { email, password } = parsedBody.data;
    const role = req.userRole;

    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not found plz signup", 404));
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid || user.role !== role) {
        return next(new AppError("Incorrect credentials", 401));
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        role === "user" ? process.env.USER_JWT_SECRET : process.env.ADMIN_JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(200).json({
        status: true,
        token,
        msg: "User signed in successfully",
    });
}));



userRoute.get("/courses", tryCatch(async (req, res) => {
    res.status(200).json({
        status: true,
        courses: await CourseModel.find({}),
    })
}))

export { userRoute };
