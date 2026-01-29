import {userModel} from '../models/user.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;


export const createUser = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { firstName, lastName, email, password } = req.body
        if (!firstName || !email || !password){
            let missing=[firstName, email, password].filter(miss => !miss).join(", ")
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}` })
        }           
        if (email.indexOf('@') === -1)
            return res.status(400).json({ title: "Not standard email"})

        let isOk = await userModel.findOne({ email: email })
        if (isOk)
            return res.status(409).json({ title: "exists user", message: "you can not open new account" })
        if (!lastName)
            lastName = "";
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const newUser = new userModel({ firstName, lastName, email, password: hashedPassword })
        let user = await newUser.save()
        return res.status(201).json({firstName: user.firstName, lastName: user.lastName})
    }
    catch (err) {
        return res.status(500).json({ title: "We have error with creating user", message: err })
    }
}

export const login= async (req, res) => {
    try{
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { email, password } = req.body
        if (!email || !password){
            let missing=[email, password].filter(miss => !miss);
            return res.status(400).json({ title: "missing data", message: `Please press your ${missing}`})
        }
        let user = await userModel.findOne({email: email})
        if (!user)
            return res.status(404).json({ title: "no user", message: "there is no user with this email, plaese register" })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ title: "wrong data", message: "We don't find such user, please try again" })
        return res.status(200).json({firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role})
    }
    catch(err){
        return res.status(500).json({ title: "Sorry, There is an error with login", message: err });
    }
}

export const getAllUsers = async (req, res) => {
    try{
        let users = await userModel.find({});
        users = users.map(u => ({firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role}));
        return res.status(200).json(users);
    }
    catch(err){
        return res.status(500).json({ title: "Sorry, There is an error with getting users", message: err });
    }
}

export const updateUser = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { password,  email, firstName, lastName } = req.body;
        if (!password || !email || !firstName || !lastName){
            let missing=[password, email, firstName, lastName].filter(miss => !miss).join(", ")
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}` })
        }
        let user = await userModel.findOne({ email: email });
        if (!user)
            return res.status(404).json({ title: "no user", message: "there is no user with this email" })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ title: "wrong password", message: "password is incorrect" })
        let updatedUser = await userModel.updateOne({ email: email }, { firstName, lastName });
        return res.status(200).json({ title: "updated user", message: `The user ${email} was updated` });
    }
    catch (err) {
        return res.status(500).json({ title: "Sorry, There is an error with updating user", message: err });
    }
}

export const deleteUser = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { firstName, lastName, password, email } = req.body;
        if (!firstName || !lastName || !password || !email){
            let missing=[firstName, lastName, password, email].filter(miss => !miss).join(", ")
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}` })
        }
        let user = await userModel.findOne({ email: email });
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch || !user) 
            return res.status(401).json({ title: "wrong data", message: "password or user name is incorrect" })
        let deletedUser = await userModel.updateOne({ email: email }, { status: "inactive" });
        return res.status(200).json({ title: "deleted user", message: `The user ${email} was deleted` });
    }
    catch (err) {
        return res.status(500).json({ title: "Sorry, There is an error with deleting user", message: err });
    }
}