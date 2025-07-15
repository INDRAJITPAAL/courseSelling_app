export function globalErrorHandler(err, req, res, next) {
    console.log(err);
    return res.status(err.statusCode).json({
        status: false,
        statusCode: err.statusCode || 500,
        error: err.message || "some thing went wrong",
        errTrace: err.stack,
    });
}