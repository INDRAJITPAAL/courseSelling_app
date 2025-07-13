const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    userName: String,
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" }
})


const courseContentSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    price: Number,
})

const purchasedSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: { type: mongoose.Types.ObjectId, ref: "Course" }
})

const User = mongoose.model("user", userSchema);
const Course = mongoose.model("Course", courseContentSchema);
const Purchased = mongoose.model("Purchased", purchasedSchema);

module.exports = {
    User,
    Course,
    Purchased
}