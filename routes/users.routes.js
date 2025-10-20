import express from 'express';
import { validateRequiredFields } from '../utils/validation.utils.js';
import { createError } from '../utils/error.utils.js';
import { addUser, getAllUsers, findUserById, updateUserById, deleteUserById } from '../services/users.service.js';
import { getUserWithoutPassword, createUser, getUsersWithoutPassword } from '../models/user.models.js';

const Router = express.Router();
const REQUIRED_FIELDS = ['nombre', 'email', 'password'];

Router.post('/api/users', async (req, res, next) => {
    try {
        const dataUser = createUser(req.body);
        const saved = await addUser(dataUser);
        const safeUser = getUserWithoutPassword(saved);
        res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: safeUser });
    } catch (err) { next(err); }
});

Router.get('/api/users', async (_req, res, next) => {
    try {
        const allUsers = await getAllUsers();
        res.status(200).json(getUsersWithoutPassword(allUsers));
    } catch (err) { next(err); }
});

Router.get('/api/users/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const user = await findUserById(id);
        res.status(200).json(getUserWithoutPassword(user));
    } catch (err) { next(err); }
});

Router.put('/api/users/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        validateRequiredFields(req.body, REQUIRED_FIELDS);
        const updated = await updateUserById(id, req.body);
        res.status(200).json({ success: true, message: 'Usuario actualizado correctamente', data: getUserWithoutPassword(updated) });
    } catch (err) { next(err); }
});

Router.patch('/api/users/:id', async (req, res, next) => {
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
        data: getUserWithoutPassword(updated)
        });
    } catch (err) {
        next(err);
    }
});

Router.delete('/api/users/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteUserById(id);

        res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente',
        data: getUserWithoutPassword(deleted)
        });
    } catch (err) {
        next(err);
    }
});

export default Router;
