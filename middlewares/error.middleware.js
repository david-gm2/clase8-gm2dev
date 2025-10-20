import { mapError } from "../utils/error.utils.js";
import { ERROR_TYPES } from "../constants.js";

export function handlingError(err, req, res, next) {
    const { status, type, message } = mapError(err);
    res.status(status).json({
        success: false,
        type,
        message
    });
}

export function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        type: ERROR_TYPES.NOT_FOUND,
        message: `Recurso no encontrado: ${req.originalUrl}`
    });
}
