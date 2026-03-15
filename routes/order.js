import express from 'express';
import { getAllOrders, createNewOrder, deleteOrder, getOrdersByUserId, updateStatus } from '../controllers/order.js';

export const router = express.Router();

router.get('/ordersbyid/:userId', getOrdersByUserId);
router.get('/orders', getAllOrders);
router.post('/order', createNewOrder);
router.delete('/order', deleteOrder);
router.put('/order', updateStatus);

export default router;