
import mongoose from 'mongoose';
import { orderModel } from "../models/order.js";
import { itemModel } from "../models/item.js";
import {userModel} from '../models/user.js';

export const createNewOrder = async (req, res) => {
    try{
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { supplyDate, addressForShipping, customerId, products, isSent } = req.body;
        if (!addressForShipping || !customerId || !products || !Array.isArray(products) || products.length === 0){
            let missing = [];
            if (!addressForShipping) missing.push('addressForShipping');
            if (!customerId) missing.push('customerId');
            if (!products || !Array.isArray(products) || products.length === 0) missing.push('products');
            return res.status(400).json({ title: "missing data", message: `There is no ${missing.join(', ')}` })
        }
        if (!mongoose.Types.ObjectId.isValid(customerId))
            return res.status(400).json({ title: "invalid user", message: "customerId is not a valid ID" })

        const customer = await userModel.findOne({ _id: customerId })
        if (!customer)
            return res.status(404).json({ title: "invalid user", message: "there is no user with such id" })

        // Validate each product record: must contain SKU and quantity (or at least SKU)
        for (const product of products) {
            if (!product || (product.SKU === undefined && product.sku === undefined))
                return res.status(400).json({ title: "invalid product", message: "Each product must include a SKU" })
            const sku = parseInt(product.SKU ?? product.sku);
            if (Number.isNaN(sku))
                return res.status(400).json({ title: "invalid product", message: "SKU must be a number" })
            const item = await itemModel.findOne({ SKU: sku });
            if (!item)
                return res.status(400).json({ title: "invalid product", message: `There is no item with SKU ${sku}` })
        }

        const newOrder = new orderModel({ supplyDate, addressForShipping, customerId, products, isSent })
        let order = await newOrder.save()
        return res.status(201).json(order)
    }
    catch(err){
        return res.status(500).json({ title: "Sorry, We have an error with creating order", message: err })
    }
}

export const deleteOrder = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { userId, orderId } = req.body;
        if (!userId || !orderId){
            let missing=[userId, orderId].filter(miss => !miss);
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}`})
        }
        const user = await userModel.findOne({ _id: userId });
        if (!user)
            return res.status(404).json({ title: "invalid user", message: "there is no user with such id" })

        const order = await orderModel.findOne({ _id: orderId });
        if (!order)
            return res.status(404).json({ title: "invalid order", message: "there is no order with such id" })

        const isOwner = order.customerId?.toString() === userId.toString();
        if ((!isOwner && user.role !== 'admin') || order.isSent)
            return res.status(403).json({ title: "forbidden", message: "you are not allowed to delete this order" })

        const deletedOrder = await orderModel.findOneAndDelete({ _id: orderId });
        return res.status(200).json({ title: "deleted", message: "order deleted successfully" })
    }
    catch (err) {
        return res.status(500).json({ title: "Error deleting order", message: err });
    }
}

export const getOrdersByUserId = async (req, res) => {
    try{
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ title: "invalid id", message: "user id is not valid" });

        const user = await userModel.findOne({_id: userId});
        if (!user)
            return res.status(404).json({ title: "invalid user", message: "there is no user with such id" });

        let orders = await orderModel.find({customerId: userId});
        if (!orders || orders.length===0)
            return res.status(404).json({ title: "sure did you order sumtime?", message: "there are no orders for this user" });
        return res.status(200).json(orders);
    }
    catch(err){
        return res.status(500).json({ title: "Sorry, we have an error", message: err });
    }
}

export const updateStatus = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { orderId, userId } = req.body;
        if (!orderId || !userId){
            let missing=[orderId, userId].filter(miss => !miss);
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}`})
        }
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId))
            return res.status(400).json({ title: "invalid id", message: "userId or orderId is not a valid id" });

        const user = await userModel.findOne({ _id: userId });
        if (!user)
            return res.status(404).json({ title: "invalid user", message: "there is no user with such id" })

        if (user.role !== 'admin')
            return res.status(403).json({ title: "forbidden", message: "you are not allowed to update this order" })

        const order = await orderModel.findOne({ _id: orderId });
        if (!order)
            return res.status(404).json({ title: "invalid order", message: "there is no order with such id" })

        order.isSent = true;
        let updatedOrder = await order.save();
        return res.status(200).json(updatedOrder);
    }
    catch (err) {
        return res.status(500).json({ title: "Error updating order", message: err });
    }
}

export const getAllOrders = async (req, res) => {
    try{
        let orders = await orderModel.find({});
        return res.status(200).json(orders);
    }
    catch(err){
        return res.status(500).json({ title: "Sorry, we have an error", message: err });
    }
}