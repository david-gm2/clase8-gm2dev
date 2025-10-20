import express from 'express';
import { validateRequiredFields } from '../utils/validation.utils.js';
import { createError } from '../utils/error.utils.js';
import { addUser, getAllUsers, findUserById, updateUserById, deleteUserById } from '../services/users.service.js';

const Router = express.Router();
const REQUIRED_FIELDS = ['nombre', 'email', 'password'];

Router.post('/', async (req, res, next) => {
    try {
        const safeData = { ...req.body };
        safeData.nombre = safeData.nombre.trim();
        safeData.email = safeData.email.trim().toLowerCase();
        const saved = await addUser(safeData);
        res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: saved });
    } catch (err) { next(err); }
});

Router.get('/', async (_req, res, next) => {
    try {
        const allUsers = await getAllUsers();
        res.status(200).json(allUsers);
    } catch (err) { next(err); }
});

Router.get('/:id', async (req, res, next) => {
    try {
        const user = await findUserById(req.params.id);
        res.status(200).json(user);
    } catch (err) { next(err); }
});

Router.put('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const safeData = { ...req.body };

        validateRequiredFields(safeData, REQUIRED_FIELDS);
        const updated = await updateUserById(id, safeData);
        res.status(200).json({ success: true, message: 'Usuario actualizado correctamente', data: updated });
    } catch (err) { next(err); }
});

Router.patch('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const updates = req.body;

        const allowed = ['nombre', 'email', 'password'];
        const enviados = allowed.filter(k => updates[k] !== undefined);
        if (enviados.length === 0)
        return next(createError(400, 'bad_request', 'Debe enviar al menos un campo: nombre, email o password'));

        const updated = await updateUserById(id, updates);
        res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: updated
    });
    } catch (err) {
        next(err);
    }
});

Router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteUserById(id);

        res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente',
        data: deleted
    });
    } catch (err) {
        next(err);
    }
});

export default Router;
