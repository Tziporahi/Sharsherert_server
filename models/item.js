import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    SKU: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    description: String,
    createDate: {type: Date, default: Date.now},
    imageUrl: String,
    price: {type: Number, required: true},
    isAvailable: {type: Boolean, default: true},
    availableInSize: {type: [String], default: []}
});

export const availableInSize = itemSchema.availableInSize;
export const itemModel = mongoose.model('Items', itemSchema);
