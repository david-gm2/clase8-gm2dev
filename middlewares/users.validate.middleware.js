import { userStrict, userPartial, login } from '../shcema/user.schema.js';
import { createError } from '../utils/error.utils.js';
import { ERROR_TYPES } from '../constants.js';

function validate(schema) {
    return (req, _res, next) => {
        const { value, error } = schema.validate(req.body ?? {},
            { abortEarly: false, stripUnknown: true });
        if (error) {
        const msg = error.details.map(d => d.message).join(', ');
        return next(createError(422, ERROR_TYPES.INVALID, msg));
        }
        req.validated = value;
        next();
    };
}

export const validateUserStrict  = validate(userStrict);
export const validateUserPartial = validate(userPartial);
export const validateLogin       = validate(login);
