import { createError } from '../utils/error.utils.js';
import { ERROR_TYPES } from '../constants.js';
import { isValidEmail , isValidPassword , isValidName , validateRequiredFields} from '../utils/validation.utils.js';
import {
    findAll,
    findByEmail,
    existsByEmail,
    save,
    update,
    deleteById,
    getUserById
} from '../repository/user.repository.js';
import { getUsersWithoutPassword, getUserWithoutPassword, createUser } from '../models/user.models.js';
import bcrypt from 'bcryptjs';

const REQUIRED_FIELDS = ['nombre', 'email', 'password'];

export async function addUser(user) {

    const dataUser = createUser(user);
    validateRequiredFields(dataUser, REQUIRED_FIELDS);

    if (!isValidEmail(dataUser.email)) throw createError(422, ERROR_TYPES.INVALID, 'Email inválido');
    if (!isValidPassword(dataUser.password)) throw createError(422, ERROR_TYPES.INVALID, 'Password inválida');
    if (!isValidName(dataUser.nombre)) throw createError(422, ERROR_TYPES.INVALID, 'Nombre inválido');

    await ensureEmailNotTaken(dataUser.email);

    const passwordHash = await bcrypt.hash(dataUser.password, 12);

    const saved = await save(dataUser, passwordHash);
    // const safeUser = getUserWithoutPassword(saved);
    return saved;
}

export async function getAllUsers() {
    const users = await findAll();
    if (!users || users.length === 0) throw createError(404, ERROR_TYPES.NOT_FOUND, 'No existen usuarios en la base de datos');
    return getUsersWithoutPassword(users);
}

export async function findUserById(id) {
    const user = await getUserById(id);
    if (!user) throw createError(404, ERROR_TYPES.NOT_FOUND, 'Usuario no encontrado');
    return getUserWithoutPassword(user);
}

export async function ensureEmailNotTaken(email, excludeId = null) {
    const user = await existsByEmail(email);

    if (user) throw createError(409, ERROR_TYPES.CONFLICT, 'Email ya existe');
}

export async function updateUserById(id, data) {
    const safeData = { ...data };

    await findUserById(id);

    delete safeData.id;
    delete safeData.createdAt;

    if (safeData.nombre !== undefined) {
        safeData.nombre = safeData.nombre.trim();
        if (!isValidName(safeData.nombre)) throw createError(422, ERROR_TYPES.INVALID, 'Nombre inválido');
    }

    if (safeData.email !== undefined) {
        safeData.email = safeData.email.trim().toLowerCase();
        if (!isValidEmail(safeData.email)) throw createError(422, ERROR_TYPES.INVALID, 'Email inválido');
        await ensureEmailNotTaken(safeData.email, id);
    }

    const updated = await update(id, safeData);

    return updated;
}

export async function updateUserRole(id, newRole) {
    await findUserById(id);

    const updated = await update(id, { role: newRole });
    return updated;
}

export async function deleteUserById(id) {
    const deleted = await deleteById(id);
    if (!deleted) throw createError(404, ERROR_TYPES.NOT_FOUND, 'Usuario no encontrado');
    return getUserWithoutPassword(deleted);
}
