const express = require("express");
const usersController = require("./../controllers/usersController");
const verifyToken = require("./../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const upload = require("../utils/upload");

const router = express.Router();

router
    .route("/")
    .get(verifyToken, allowedTo("MANAGER"), usersController.getAllUsers);

router
    .route("/register")
    .post(upload.single("avatar"), usersController.register);

router.route("/login").post(usersController.login);

module.exports = router;
