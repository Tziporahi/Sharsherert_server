import express from 'express';
import { getAllOrders, createNewOrder, deleteOrder, getOrdersByUserId, updateStatus } from '../controllers/order';

export const router = express.Router();

router.get('/ordersbyid/:userId', getOrdersByUserId);
router.get('/orders', getAllOrders);
router.post('/order', createNewOrder);
router.delete('/order/:id', deleteOrder);
router.put('/order/:id', updateStatus);
