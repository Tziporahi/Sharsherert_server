import mongoose from 'mongoose';
import { availableInSize } from './item.js';

const minimalItemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    isAvailable: {type: Boolean, default: true},
    chooseSize: {type: String, validate: {
            validator: function(v) {
                return this.availableInSize.includes(v);
            },
            message: p => `${p.value} is not a valid size!`
        }}
});

const orderSchema = new mongoose.Schema({
    ordDate: {type: Date, default: Date.now},
    supplyDate: Date,
    addressForShipping: {type: String, required: true},
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    products: [minimalItemSchema],
    isSent:{type: Boolean, default: false}
});
export const orderModel = mongoose.model('Orders', orderSchema);