import { UserRepository } from "../repository/user.repository.js";
import { getPublicUser } from '../models/user.models.js'
import { createUserService , findUserService , updateUserService , deleteUserService , loginUserService} from'../services/users.service.js'

export async function listUsers(req, res, next) {
    try {
        const users = await UserRepository.list({ order: [['created_at', 'DESC']] });
        res.status(200).json(getPublicUser(users));
    } catch (err) {
        next(err);
    }
}

export async function createUser(req, res, next) {
    try {
        const created = await createUserService(req.validated);
        res.status(201).json({
        success: true,
        message: 'Usuario creado',
        data: getPublicUser(created),
        });
    } catch (err) {
        next(err);
    }
}

export async function findUserById(req, res, next) {
    try {
        const user = await findUserService(req.userId);
        res.status(200).json(getPublicUser(user));
    } catch (err) {
        next(err);
    }
}

export async function updateUserById(req, res, next) {
    try {
        const updated = await updateUserService({
        id: req.userId,
        changes: req.validated,
        });

        res.status(200).json({
        success: true,
        message: 'Usuario actualizado',
        data: getPublicUser(updated),
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteUserById(req, res, next) {
    try {
        await deleteUserService(req.userId);
        res.status(204).send();
    } catch (err) { next(err); }
}

export async function loginUser(req, res, next) {
    try {
        const { logged, token } = await loginUserService(req.validated);
        console.log(logged)
        res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: getPublicUser(logged),
        token,
        });
    } catch (err) {
        next(err);
    }
}