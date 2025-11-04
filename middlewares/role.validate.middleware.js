import dotenv from 'dotenv';
import { createError } from "../utils/error.utils.js";

dotenv.config();

export function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.auth)
        return next(createError(401, process.env.UNAUTHORIZED, 'Token requerido'));

        const { role } = req.auth;
        if (!allowedRoles.includes(role))
        return next(createError(403, process.env.UNAUTHORIZED, 'Acceso denegado'));

        next();
    };
}
