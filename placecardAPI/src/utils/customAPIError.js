function CustomAPIError(message, type, status) {
    this.message = message;
    this.type = type;
    this.status = status;
}

module.exports = CustomAPIError;
