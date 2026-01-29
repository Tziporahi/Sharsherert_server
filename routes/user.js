import express from 'express';
import { createUser, login, getAllUsers } from '../controllers/user.js';

export const router = express.Router();

router.get('/user', getAllUsers);
router.post('/login', login);
router.post('/user', createUser);
router.post('/updateuser', updateUser);
router.delete('/deleteuser', deleteUser);

export default router;