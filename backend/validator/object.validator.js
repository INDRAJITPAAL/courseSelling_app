const { z, email } = require("zod");

const signupBody = z.object({
    userName: z.string().min(1).max(100),
    email: z.email().string().min(1).max(100),
    password: z.string(),
    role: z.string().enum(["user", "admin"])
});

module.exports = {
    signupBody,
}