const express = require("express");
const userRoute = express.Router();
const { signupBody, signinBody } = require("../validator/object.validator");
const { userModel } = require("../models/db.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRoute.post("/signup", async (req, res, next) => {

    const parsedBody = signupBody.safeParse(req.body);
    if (!parsedBody.success) {
        res.json({
            status: false,
            error: parsedBody.error,
        })
    }

    const { userName, email, password, role } = parsedBody;

    const user = await userModel.findOne({ email }).select("-password");
    if (user) {
        res.status(501).json({
            status: false,
            msg: "user already in use!"
        })
        return;
    }


    // Create the user first

    const hashedPass = bcrypt.genSaltSync(password, 8);
    const newUser = await userModel.create({ userName, email, password: hashedPass, role });
    const token = jwt.sign(
        { userId: newUser._id },
        role == "user" ? process.env.USER_JWT_SECERET : process.env.ADMIN_JWT_SECERET
    );
    res.status(200).json({
        status: true,
        token,
        msg: "user signup success",
    })
    return;

})

userRoute.post("/signin", async (req, res, next) => {

    const parsedBody = signinBody.safeParse(req.body);
    if (!parsedBody.success) {
        res.json({
            status: false,
            error: parsedBody.error,
        })
    }

    const { email, password, role } = parsedBody;

    const user = await userModel.findOne({ email });
    const isValid = bcrypt.compare(password, user.password);

    if (email === user.email && isValid) {
        const token = jwt.sign(
            { userId: user._id },
            role == "user" ? process.env.USER_JWT_SECERET : process.env.ADMIN_JWT_SECERET
        );
        res.status(200).json({
            status: true,
            token,
            msg: "user signup success",
        })
        return;
    } else {
        return res.status(404).json({
            status: false,
            msg: "incorrect credential"
        })
    }

})