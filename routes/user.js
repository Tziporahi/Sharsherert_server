import express from 'express';
import { createUser, login, getAllUsers, updateUser, deleteUser } from '../controllers/user.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

export const router = express.Router();

router.get('/user', getAllUsers);
router.post('/login', login);
router.post('/user', createUser);
router.post('/updateuser', authenticateToken, updateUser);
router.delete('/deleteuser', authenticateToken, requireAdmin, deleteUser);

export default router;