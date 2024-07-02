const express = require("express");
const { body } = require("express-validator");
const courseController = require("./../controllers/coursesController");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");

const router = express.Router();

const validator = [
    body("title")
        .notEmpty()
        .withMessage("title required")
        .isLength({ min: 2 })
        .withMessage("title at least 2 chars"),

    body("price").notEmpty().withMessage("price required"),
];

router
    .route("/")
    .get(verifyToken, courseController.getAllCourses)
    .post(validator, courseController.createCourse);

router
    .route("/:id")
    .patch(courseController.updateCourse)
    .get(courseController.getCourse)
    .delete(
        verifyToken,
        allowedTo("ADMIN", "MANAGER"),
        courseController.deleteCourse
    );

module.exports = router;
