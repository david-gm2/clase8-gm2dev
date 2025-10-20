import { createError } from '../utils/error.utils.js';
import { isValidEmail , isValidPassword , isValidName , validateRequiredFields} from '../utils/validation.utils.js';
import {
    findAll,
    findById,
    findByEmail,
    existsByEmail,
    save,
    update,
    deleteById
} from '../repository/user.repository.js';

const REQUIRED_FIELDS = ['nombre', 'email', 'password'];

export async function addUser(user) {
  validateRequiredFields(user, REQUIRED_FIELDS);

  if (!isValidEmail(user.email)) throw createError(422, 'invalid', 'Email inválido');
  if (!isValidPassword(user.password)) throw createError(422, 'invalid', 'Password inválida');
  if (!isValidName(user.nombre)) throw createError(422, 'invalid', 'Nombre inválido');

  await ensureEmailNotTaken(user.email);
  return save(user);
}

export async function getAllUsers() {
    const users = await findAll();
    if (!users || users.length === 0)
    throw createError(404, 'not_found', 'No existen usuarios en la base de datos');
    return users;
}

export async function findUserById(id) {
    const user = await findById(id);
    if (!user) throw createError(404, 'not_found', 'Usuario no encontrado');
    return user;
}

export async function ensureEmailNotTaken(email, excludeId = null) {
    const user = await findByEmail(email);

    if (user && String(user.id) !== String(excludeId)) {
        throw createError(409, 'conflict', 'Email ya existe');
    }
}

export async function updateUserById(id, data) {
    const safeData = { ...data };

    delete safeData.id;
    delete safeData.createdAt;

    if (safeData.nombre !== undefined) {
        safeData.nombre = safeData.nombre.trim();
        if (!isValidName(safeData.nombre)) throw createError(422, 'invalid', 'Nombre inválido');
    }

    if (safeData.email !== undefined) {
        safeData.email = safeData.email.trim().toLowerCase();
        if (!isValidEmail(safeData.email)) throw createError(422, 'invalid', 'Email inválido');
        await ensureEmailNotTaken(safeData.email, id);
    }

    if (safeData.password !== undefined) {
        if (!isValidPassword(safeData.password)) throw createError(422, 'invalid', 'Password inválida');
    }

    const updated = await update(id, safeData);
    if (!updated) throw createError(404, 'not_found', 'Usuario no encontrado');
    return updated;
}

export async function deleteUserById(id) {
    const deleted = await deleteById(id);
    if (!deleted) throw createError(404, 'not_found', 'Usuario no encontrado');
    return deleted;
}
