import { UserRepository } from '../repository/user.repository.js';
import { createError } from '../utils/error.utils.js';
import { ERROR_TYPES } from '../constants.js';
import { hash, compare } from '../utils/hash.utils.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export async function createUserService({ nombre, email, password }) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw createError(409, ERROR_TYPES.CONFLICT, 'Email ya registrado');

    const passwordHash = await hash(password, 12);

    const newUser = await UserRepository.create({
        nombre,
        email,
        password: passwordHash,
    });

    return newUser;
}

export async function findUserService(id) {
    const user = await UserRepository.get(id);
    if (!user) throw createError(404, ERROR_TYPES.NOT_FOUND, 'Usuario no encontrado');
    return user;
}

export async function updateUserService({ id, changes }) {
    const existing = await UserRepository.get(id);
    if (!existing) throw createError(404, ERROR_TYPES.NOT_FOUND, 'Usuario no encontrado');

    const dataToUpdate = {};

    if (changes.nombre) dataToUpdate.nombre = changes.nombre;

    if (changes.email && changes.email !== existing.email) {
        const clash = await UserRepository.findByEmail(changes.email);
        if (clash && clash.id !== id) throw createError(409, ERROR_TYPES.CONFLICT, 'Email ya registrado');
        dataToUpdate.email = changes.email;
    }

    if (changes.password) dataToUpdate.password = await hash(changes.password, 12);

    if (Object.keys(dataToUpdate).length === 0) return existing;

    return await UserRepository.update(id, dataToUpdate);
}

export async function deleteUserService(id) {
    const existing = await UserRepository.get(id);
    if (!existing) throw createError(404, ERROR_TYPES.NOT_FOUND, 'Usuario no encontrado');

    const deleted = await UserRepository.delete(id);
    if (deleted === 0) throw createError(500, ERROR_TYPES.INTERNAL, 'No se pudo eliminar');

    return { id, deleted: true };
}

export async function loginUserService({email,password}) {
    const userExist = await UserRepository.findByEmail(email);
    if (!userExist) throw createError(401, ERROR_TYPES.UNAUTHORIZED, 'Credenciales inválidas');

    const match = await compare(password, userExist.password);
    if ( !match) throw createError(401, ERROR_TYPES.UNAUTHORIZED, 'Credenciales inválidas');

    const token = jwt.sign({
        id: userExist.id,
        role: userExist.role
    }, process.env.SECRET_JWT_KEY, {
        expiresIn: '1h'
    });
    
    return { logged: userExist, token };
}
