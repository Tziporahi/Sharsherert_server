import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    status: {type: String, enum: ['active', 'inactive'], default: 'active'}
}, {timestamps: true});

import bcrypt from 'bcrypt';

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const userModel = mongoose.model('User', userSchema);