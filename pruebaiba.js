import Joi from "joi";

/*

hacemos esquemas para validacion
definimos cada esquema con su respectiva validacion y sanatizacion
validate schemas
next()

*/

// * schema
export const userRegistrerSchema = Joi.object({
    name: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).max(20).required()
});

const userData = {
    name: "jasdaso",
    email: "john@example.com",
    password: "sesada123",
    age: '123'
};

const { error, value } = userRegistrerSchema.validate(userData, { abortEarly: false, stripUnknown: true });

if (error) {
    console.error("Error de validación:", error.details);
} else {
    console.log("Datos válidos:", value);
}