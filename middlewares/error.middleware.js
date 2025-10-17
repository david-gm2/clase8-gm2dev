import { mapError } from "../utils/error.utils.js";

export function handlingError(err, req, res, next) {
    const { status, type, message } = mapError(err);
    res.status(status).json({ success: false, type, message });
}