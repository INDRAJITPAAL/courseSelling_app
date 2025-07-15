import express from 'express';
import mongoose from 'mongoose';
import { userRoute } from './routes/user.route.js';
import { userPurchaseRoute } from "./routes/userPurchase.route.js";
import { globalErrorHandler } from './utils/GlobalError.handler.utils.js';
import { courseRoute } from './routes/course.route.js';
import { tryCatch } from './utils/tryCatch.handler.error.utils.js';
import { CourseModel } from './models/db.models.js';


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        msg: 'Course Selling App Backend is running!'
    });
});

app.get("/courses", tryCatch(async (req, res) => {
    res.status(200).json({
        status: true,
        courses: (await CourseModel.find({})),
    })
}))

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", userPurchaseRoute);


app.use(globalErrorHandler);

// Start the server
function main() {
    const PORT = process.env.PORT || 3000;
    const DB_URL = process.env.DB_URL || "";
    const LOCAL_dB_URL = process.env.LOCAL_dB_URL || "";
    mongoose.connect(LOCAL_dB_URL).then(() => {
        console.log("connected");
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    }).catch((e) => console.error(e.message));
}
main();