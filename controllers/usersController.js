const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/appError");
const UserM = require("./../models/user-model");
const jwt = require("jsonwebtoken");

const createToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET, {
        // to generate secret require('crypto').randomBytes(32).toString('hex')
        expiresIn: "1d",
    });
};

const getAllUsers = asyncWrapper(async (req, res, next) => {
    // console.log(req.headers);
    const users = await UserM.find({}, { password: false, __v: false });
    if (!users) {
        return next(AppError.create("fail", 404, "no users found"));
    }

    res.status(200).json({
        status: "success",
        data: {
            users,
        },
    });
});

const register = asyncWrapper(async (req, res, next) => {
    const { name, email, password, passwordConfirm, role } = req.body;
    if (!email || !password) {
        return next(
            AppError.create("fail", 404, "Email And Password Are Required")
        );
    }
    const newUser = new UserM({
        name,
        email,
        password,
        passwordConfirm,
        role,
        avatar: req.file.filename,
    });
    await newUser.save();

    const token = createToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
    });

    res.status(201).json({
        status: "success",
        data: {
            newUser,
            token,
        },
    });
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserM.findOne({ email }); // must be [findOne]

    if (!user || !(await user.correctPass(user.password, password))) {
        return next(AppError.create("fail", 404, "Worng Email or Password"));
    }

    const token = createToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });
    res.status(200).json({
        status: "success",
        data: {
            token,
        },
    });
});

module.exports = {
    getAllUsers,
    login,
    register,
};
