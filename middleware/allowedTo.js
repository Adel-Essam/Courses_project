const appError = require("../utils/appError");

module.exports = allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            return next(
                appError.create("fail", 401, "this role is not authorized")
            );
        }
        next();
    };
};
