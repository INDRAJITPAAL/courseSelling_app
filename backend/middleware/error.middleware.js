export function globalErrorHandler(err, req, res, next) {
    console.log(err.stack);
    return res.json({
        status: err.status,
        error: err.message,
        errTrace: err.stack,
    });
}