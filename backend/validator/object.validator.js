import { z } from "zod";

export const signupBody = z.object({
    userName: z.string().min(1).max(100),
    email: z.string().email().min(1).max(100),
    password: z.string().min(6).max(100),
    role: z.enum(["user", "admin"])
});

export const signinBody = z.object({
    email: z.string().email().min(1).max(100),
    password: z.string().min(6).max(100),
    role: z.enum(["user", "admin"])
});

export const userPurchase = z.object({
    courseId: z.string()
});

export const courseCreate = z.object({
    title: z.string().min(1).max(1000),
    description: z.string().min(1).max(1000),
    price: z.number().min(0),
    imageUrl: z.string(),
})
export const courseUpdate = z.object({
    title: z.string().min(1).max(1000),
    description: z.string().min(1).max(1000),
    price: z.number().min(0),
    imageUrl: z.string(),
    courseId:z.string(),
})

