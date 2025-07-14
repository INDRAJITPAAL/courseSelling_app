const { z } = require("zod");

const signupBody = z.object({
    userName: z.string().min(1).max(100),
    email: z.string().email().min(1).max(100),
    password: z.string().min(6).max(100),
    role: z.enum(["user", "admin"])
});

const signinBody = z.object({
    email: z.string().email().min(1).max(100),
    password: z.string().min(6).max(100),
    role: z.enum(["user", "admin"])
});

module.exports = {
    signupBody,
    signinBody
};
