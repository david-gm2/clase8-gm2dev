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
            success: true,
            message: 'Hola, soy js en formato .json'
        });
    });

    app.use(usersRouter);
    app.use(handlingError);
    return app;
}
