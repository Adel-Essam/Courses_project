const express = require("express");
const Courseroutes = require("./routes/coursesRoutes");
const Userroutes = require("./routes/usersRoutes");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Mongo DB Connected Successfully");
});

const app = express();
app.use(express.json());

app.use(cors()); // the cors module enables us to connect the backend to the front end

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/courses", Courseroutes);

app.use("/api/users", Userroutes);

// global middleware for not found routes
app.all("*", (req, res, next) => {
    return res
        .status(404)
        .json({ status: "error", message: "This resourse is not available" });
});

// global error handler
app.use((error, req, res, next) => {
    res.status(error.stastusCode || 500).json({
        status: error.status || "error",
        message: error.message,
    });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});
