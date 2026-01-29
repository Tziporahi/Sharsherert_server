import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    status: {type: String, enum: ['active', 'inactive'], default: 'active'}
}, {timestamps: true});

export const userModel = mongoose.model('User', userSchema);