const express = require('express');
const mongoose = require("mongoose");
const app = express();
const { userRoute } = require("./routes/user.route");
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded());

// Basic route
app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        msg: 'Course Selling App Backend is running!'
    });
});

app.use("/api/v1/user",userRoute);

// Start the server
function main() {
    const PORT = process.env.PORT || 3000;
    const DB_URL = process.env.DB_URL || "";
    mongoose.connect(DB_URL).then(() => {
        console.log("connected");
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });

    }).catch((e) => console.error(e.message))

}
main();