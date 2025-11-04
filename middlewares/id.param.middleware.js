import { createError } from '../utils/error.utils.js';
import { ERROR_TYPES } from '../constants.js';

export function requireNumericId(req, _res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(createError(400, ERROR_TYPES.INVALID, 'ID inválido'));
    req.userId = id;
    next();
}
