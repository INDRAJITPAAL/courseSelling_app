import express from 'express';
import mongoose from 'mongoose';
import { userRoute, purchageRoute, courseRoute } from './routes/user.route.js';

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

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchageRoute);

// Start the server
function main() {
    const PORT = process.env.PORT || 3000;
    const DB_URL = process.env.DB_URL || "";
    mongoose.connect(DB_URL).then(() => {
        console.log("connected");
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    }).catch((e) => console.error(e.message));
}
main();