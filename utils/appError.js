class AppError extends Error {
    constructor() {
        super();
    }
    create(status, stastusCode, message) {
        this.status = status;
        this.stastusCode = stastusCode;
        this.message = message;
        return this;
    }
}

module.exports = new AppError();
