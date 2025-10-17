import { createError } from "./error.utils.js";

export function validateRequiredFields(data, requiredFields) {
    for (const field of requiredFields) {
        const value = data[field];

        if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
        ) {
            throw createError(400, 'bad_request', `El campo ${field} is required`);
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
    if (typeof name !== 'string' || name.trim() === '') return false;
}