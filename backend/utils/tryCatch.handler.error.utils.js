import { AppError } from "./AppError.class.utils";

export function tryCatch(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(new AppError(error.message, 500));
        }
    };
}

