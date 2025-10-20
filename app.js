import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.routes.js';
import { handlingError } from './middlewares/error.middleware.js';

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
    res.json({
        message: 'API de usuarios - Ejercicio 2',
        version: '2.0',
        architecture: 'Routes → Repository + Model'
    });
});

    app.use(usersRouter);
    app.use(handlingError);
    return app;
}
