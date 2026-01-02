import { useId } from "react";
import { orderModel } from "../models/order.js";
import userModel from '../models/user.js';

export const createNewOrder = async (req, res) => {
    try{
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { supplyDate, addressForShipping, customerId, products, isSent } = req.body;
        if (!addressForShipping || !customerId || !products){
            let missing=[addressForShipping, customerId, products].filter(miss => !miss).join(", ");
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}` })
        }
        const isOk = await userModel.findOne({ customerId: customerId})
        if (!isOk)
            return res.status(404).json({ title: "invalid user", message: "there is no user with such id" })
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
        userId=parseInt(userId);
        orderId=parseInt(orderId);
        if (!userId || !orderId){
            let missing=[userId, orderId].filter(miss => !miss);
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}`})
        }
        const user = await userModel.findOne({ _id: userId });
        const order = await orderModel.findOne({ _id: orderId });
        if (!user || userId!==orderId.customerId && user.role!=='admin' || order.isSent)
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
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let userId = parseInt(req.params.id);
        if (!userId || !userModel.findOne({_id: userId}))
            return res.status(400).json({ title: "did not recognize id", message: "" });
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
        orderId=parseInt(orderId);
        userId=parseInt(userId);
        if (!orderId || !userId){
            let missing=[orderId, userId].filter(miss => !miss);
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}`})
        }
        const user = await userModel.findOne({ _id: userId });
        const order = await orderModel.findOne({ _id: orderId });
        if (!user || user.role !== 'admin')
            return res.status(403).json({ title: "forbidden", message: "you are not allowed to update this order" })
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