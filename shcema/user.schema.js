import Joi from "joi";
export const userStrict = Joi.object({
    nombre: Joi.string().min(2).max(60).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).max(128).required(),
});

export const userPartial = Joi.object({
    nombre: Joi.string().min(2).max(60),
    email: Joi.string().email({ tlds: { allow: false } }),
    password: Joi.string().min(6).max(128),
}).min(1);

export const login = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).max(128).required(),
});
