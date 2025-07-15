import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { AppError } from "../utils/AppError.class.utils";

export function auth(jwtPassword) {
    return function (req, res, next) {
        const tokenBearer = req.headers.authorization;
        if (!tokenBearer || !tokenBearer.startsWith("Bearer ")) {
            return next(new AppError("Authorization header missing or malformed", 401));
        }
        const token = tokenBearer.split(" ")[1];
        let userPayload;
        try {
            userPayload = jwt.verify(token, jwtPassword);
        } catch (err) {
            return next(new AppError("Invalid or expired token", 401));
        }
        if (!userPayload) {
            return next(new AppError("Log in first", 404));
        } else {
            req.userId = userPayload.userId;
            req.userRole=(userPayload.role);
            return next();
        }
    }
}
