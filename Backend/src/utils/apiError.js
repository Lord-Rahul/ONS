class ApiError extends Error {
  constructor(
    status,
    message = "something went wrong !",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statuscode = status;
    this.data = null;
    this.message = message;
    this.sucess = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
