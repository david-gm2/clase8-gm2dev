import { createError } from "./error.utils.js";
import { ERROR_TYPES } from "../constants.js";

export function validateRequiredFields(data, requiredFields) {
    for (const field of requiredFields) {
        const value = data[field];

        if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
        ) {
            throw createError(400, ERROR_TYPES.BAD_REQUEST, `El campo ${field} is required`);
        }
    }
}

export function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPassword(password, minLength = 6) {
    if (typeof password !== 'string') return false;
    return password.length >= minLength;
}

export function isValidName(name) {
    if (name.trim().length === 0) return false;
    return true; 
}