const { validationResult } = require("express-validator");

const CourseC = require("./../models/course-model");

const asyncWrapper = require("../utils/asyncWrapper");

const AppError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res) => {
    // this is called pagenation and it is about sending the data in chunks not all at once
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await CourseC.find().limit(limit).skip(skip);

    res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
    });
});

const getCourse = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const course = await CourseC.findById(id);
    if (!course) {
        const error = AppError.create("fail", 404, "Not found course");
        return next(error);
    }
    res.status(200).json({
        status: "success",
        data: { course },
    });
});

const createCourse = asyncWrapper(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "fail", data: errors.array() });
    }

    const newCourse = new CourseC(req.body);
    await newCourse.save();

    res.status(201).json({
        status: "success",
        data: { course: newCourse },
    });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    // we can use this way : bcz (findByIdAndUpdate) returns the old result
    await CourseC.findByIdAndUpdate(id, { $set: { ...req.body } });
    const course = await CourseC.findById(id);
    // or this way :
    // const course = await CourseC.updateOne(
    //     { _id: id },
    //     { $set: { ...req.body } }
    // );
    if (!course) {
        const error = AppError.create("fail", 404, "Not found course");
        return next(error);
    }

    res.status(200).json({
        status: "success",
        data: { course },
    });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    await CourseC.deleteOne({ _id: id });
    res.status(200).json({
        status: "success",
        data: null,
    });
});

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};
