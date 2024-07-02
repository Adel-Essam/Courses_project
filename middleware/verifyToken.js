const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");

const verifyToken = (req, res, next) => {
    const auth = req.headers["Authorization"] || req.headers["authorization"];
    if (!auth) return next(appError.create("fail", 401, "token required"));

    const token = auth.split(" ")[1];
    try {
        const currentUser = jwt.verify(token, process.env.SECRET);
        req.currentUser = currentUser;
        next();
    } catch (err) {
        return next(appError.create("fail", 401, "invalid token"));
    }
};

module.exports = verifyToken;
