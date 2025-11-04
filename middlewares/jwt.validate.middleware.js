import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createError } from '../utils/error.utils.js';

dotenv.config();

export function validateToken(req, _res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token)
        return next(createError(401, process.env.UNAUTHORIZED, 'Token requerido'));

    try {
        req.auth = jwt.verify(token, process.env.SECRET_JWT_KEY);
        next(); 
    } catch {
        next(createError(401, process.env.UNAUTHORIZED, 'Token inválido o expirado'));
    }
}
