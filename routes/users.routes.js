import { requireNumericId } from '../middlewares/id.param.middleware.js';
import { validateLogin, validateUserPartial, validateUserStrict } from '../middlewares/users.validate.middleware.js'
import { validateToken } from '../middlewares/jwt.validate.middleware.js'
import { requireRole } from '../middlewares/role.validate.middleware.js'
import { createUser , listUsers, findUserById , updateUserById , deleteUserById , loginUser} from '../controllers/user.controllers.js';

import express from 'express';
const Router = express.Router();

Router.get('/user/user/', listUsers);
Router.post('/user/', validateUserStrict, createUser);

Router.get('/user/:id', requireNumericId, findUserById);
Router.put('/user/:id', requireNumericId ,validateUserStrict, updateUserById);
Router.patch('/user/:id', requireNumericId, validateUserPartial, updateUserById);
Router.delete('/user/:id', requireNumericId, deleteUserById);

Router.post('/login', validateLogin, loginUser)

Router.get('/data',
    validateToken,
    requireRole('admin'),
    (_req, res) => {
    res.json({ message: 'Bienvenido al panel de admin' });
    }
)


export default Router;
