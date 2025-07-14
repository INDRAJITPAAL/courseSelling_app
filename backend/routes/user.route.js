import express from "express";
import { signupBody, signinBody } from "../validator/object.validator.js";
import { UserModel } from "../models/db.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRoute = express.Router();

// ----------- SIGNUP ----------
userRoute.post("/signup", async (req, res) => {
    const parsedBody = signupBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            status: false,
            error: parsedBody.error.format(),
        });
    }
    const { userName, email, password, role } = parsedBody.data;
    const existingUser = await UserModel.findOne({ email }).select("-password");
    if (existingUser) {
        return res.status(409).json({
            status: false,
            msg: "Email already in use!",
        });
    }
    const hashedPass = await bcrypt.hash(password, 8);
    const newUser = await UserModel.create({ userName, email, password: hashedPass, role });

    const token = jwt.sign(
        { userId: newUser._id },
        role === "user" ? process.env.USER_JWT_SECRET : process.env.ADMIN_JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(201).json({
        status: true,
        token,
        msg: "User signed up successfully",
    });
});

// ----------- SIGNIN ----------
userRoute.post("/signin", async (req, res) => {
    const parsedBody = signinBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            status: false,
            error: parsedBody.error.format(),
        });
    }

    const { email, password, role } = parsedBody.data;

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            status: false,
            msg: "User not found",
        });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid || user.role !== role) {
        return res.status(401).json({
            status: false,
            msg: "Incorrect credentials",
        });
    }

    const token = jwt.sign(
        { userId: user._id },
        role === "user" ? process.env.USER_JWT_SECRET : process.env.ADMIN_JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(200).json({
        status: true,
        token,
        msg: "User signed in successfully",
    });
});

export default { userRoute };
