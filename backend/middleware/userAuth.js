import jwt from "jsonwebtoken";

function auth(jwtPassword) {
    return function (req, res, next) {
        const token = req.header.authorization;
        const userPayload = jwt.verify(jwtPassword, token);
        if (!userPayload) {
            res.status(404).json({
                status: false,
                msg: "log in first",
            })
            return;
        } else {
            req.userId = userPayload.userId;
            return next();
        }
    }
}