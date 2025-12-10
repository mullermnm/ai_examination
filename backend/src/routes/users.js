import express from 'express';
import usersController from '../controller/users.js';
import UsersSchema from '../validators/Joi/schemas/users.js';
import valMiddleware from '../validators/Joi/middleware.js';

const router = express.Router();

    // list users (optional query filters)
    router.get('/', usersController.getAllUsers);

    router.post('/signin', valMiddleware(UsersSchema.signIn), usersController.signin);

export default router;