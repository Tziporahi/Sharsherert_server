import express from 'express';
import { createUser, login, getAllUsers } from '../controllers/user.js';

export const router = express.Router();

router.get('/user', getAllUsers);
router.post('/login', login);
router.post('/user', createUser);

export default router;