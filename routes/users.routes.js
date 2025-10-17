import express from 'express'
import { validateRequiredFields, isValidEmail, isValidPassword, isValidName } from '../utils/validation.utils.js';
import { createError } from '../utils/error.utils.js';
import { UsersService } from '../data/users.data.js';


const Router = express.Router();
const REQUIRED_FIELDS = ['nombre', 'email', 'password'];
const usersService = new UsersService()


Router.post('/api/users', async (req, res, next) => {
    try {
        const dataUser = req.body;
        validateRequiredFields(dataUser, REQUIRED_FIELDS);
        if (!isValidEmail(dataUser.email)) throw createError(422, 'invalid', 'Email invalido');
        if (!isValidPassword(dataUser.password)) throw createError(422, 'invalid', 'Password invalida');
        if (!isValidName(updatesUser.nombre)) throw createError(422, 'invalid', 'Nombre inválido');

        if (await usersService.emailExists(dataUser.email)) throw createError(409, 'conflict', 'Emial ya existe');

        const user = {
            id: Date.now(),
            nombre: dataUser.nombre,
            email: dataUser.email,
            password: dataUser.password,
            createdAt: new Date().toISOString()
        };

        usersService.addUser(user);

        const { password, ...safeUser } = user;

        res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente",
            data: safeUser
        });
    } catch (err) {
        next(err)
    }
});

Router.get('/api/users', async (req, res, next) => {
    try {
        const allUsers = await usersService.getAllUsers();

        if (!allUsers) throw createError (404, 'not_found', 'no existen usuarios en la base de datos' );

        const safeUsers = allUsers.map(({ password, ...safeUser }) => safeUser);

        res.status(200).json(safeUsers);
    } catch (err) {
        next(err);
    }
});

Router.get('/api/users/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    try {
        
        const user = await usersService.findUserById(id);
        if (!user) throw createError (404, 'not_found', 'El usurio no existe' );

        const { password, ...safeUserById } = user;

        res.status(200).json(safeUserById);
    } catch (err) {
        next(err);
    }
});

Router.put('/api/users/:id', async (req, res, next) => {
    try {
        const idSearch = Number(req.params.id);
        const user = await usersService.findUserById(idSearch);
        if (!user) throw createError (404, 'not_found', 'El usurio no existe' );

        const updatesUser = req.body;

        validateRequiredFields(updatesUser, REQUIRED_FIELDS);
        if (!isValidEmail(updatesUser.email)) throw createError(422, 'invalid', 'Email invalido');
        if (!isValidPassword(updatesUser.password)) throw createError(422, 'invalid', 'Password invalida');
        if (!isValidName(updatesUser.nombre)) throw createError(422, 'invalid', 'Nombre inválido');

        if (await usersService.emailExists(updatesUser.email)) throw createError(409, 'conflict', 'Emial ya existe');

        const updated = await usersService.updateUserById(idSearch, updatesUser);

        const { password, ...safeUser } = updated;

        res.status(200).json({ success: true, message: 'Usuario actualizado correctamente' , data: safeUser});
    } catch (err) {
        next(err);
    }
});

Router.patch('/api/users/:id', async (req, res, next) => {
    try {
        const idSearch = Number(req.params.id);
        const existing = await usersService.findUserById(idSearch);
        if (!existing) throw createError(404, 'not_found', 'El usuario no existe');

        const updates = req.body;

        const allowed = ['nombre', 'email', 'password'];
        const enviados = allowed.filter(a => updates[a] !== undefined);
        if (enviados.length === 0)
        throw createError(400, 'bad_request', 'Debe enviar al menos un campo: nombre, email o password');

        if (updates.email) {
            if (!isValidEmail(updates.email)) throw createError(422, 'invalid', 'Email inválido');
            if (await usersService.emailExists(updates.email, id)) throw createError(409, 'conflict', 'Email ya existe');
        }

        if (updates.nombre) {
            if (!isValidName(updates.nombre)) throw createError(422, 'invalid', 'Nombre inválido');
        }

        if (updates.password && !isValidPassword(updates.password)) throw createError(422, 'invalid', 'Password inválida');

        const updated = await usersService.updateUserById(idSearch, updates);
        const { password, ...safeUser } = updated;

        res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: safeUser
        });
    } catch (err) {
        next(err);
    }
});

Router.delete('/api/users/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const user = await usersService.findUserById(id);
        if (!user) throw createError(404, 'not_found', 'El usuario no existe');

        await usersService.deleteUserById(id);

        const { password, ...safeUser } = user;
        res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente',
        data: safeUser
        });
    } catch (err) {
        next(err);
    }
});

export default Router;
