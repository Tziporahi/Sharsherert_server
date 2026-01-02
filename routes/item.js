import express from 'express';

import { createItem, getAllItems, getItemById, updateItem, deleteItem } from '../controllers/item.js';

export const router = express.Router();

router.get('/byid/:id', getItemById);
router.get('/product', getAllItems);
router.post('/product', createItem);
router.put('/product/:id', updateItem);
router.delete('/product/:id', deleteItem);
