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
    CreatorId:String,
})

const purchasedSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: { type: mongoose.Types.ObjectId, ref: "Course" }
})

const UserModel = mongoose.model("user", userSchema);
const CourseModel = mongoose.model("Course", courseContentSchema);
const PurchasedModel = mongoose.model("Purchased", purchasedSchema);

module.exports = {
    UserModel,
    CourseModel,
    PurchasedModel
}