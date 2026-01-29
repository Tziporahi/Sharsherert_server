import { itemModel } from "../models/item.js"; 

export const getAllItems = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 6;
        let page = parseInt(req.query.page) || 1; // ביצוע שאילתה אחת יעילה הכוללת סינון שדות ודפדוף
        const items = await itemModel.find({})
            .select('SKU name description imageUrl price isAvailable') // בחירת השדות הנדרשים בלבד
            .skip((page - 1) * limit)
            .limit(limit);
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ 
            title: "Sorry, we have an error", 
            message: err.message || err 
        });
    }
}

export const getItemById = async (req, res) => {
    try{
        let SKU = parseInt(req.params.id);
        if (!SKU)
            return res.status(400).json({ title: "press item id", message: "" });
        let item = await itemModel.findOne({SKU: SKU});
        if (!item)
            return res.status(404).json({ title: "Oops, you have a mistake", message: "there is no item with such id" });
        return res.status(200).json(item);
    }
    catch(err){
        return res.status(500).json({ title: "Sorry, we have an error", message: err });
    }
}

export const createItem = async (req, res) => {
    try{
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let {SKU, name, description, createDate, imageUrl, price, isAvailable, availableInSize}= req.body;
        if (!SKU || !name || !price){
            let missing=[SKU, name, price].filter(miss => !miss).join(", ");
            return res.status(400).json({ title: "missing data", message: `There is no ${missing}` })
        }
        if (price <= 0)
            return res.status(400).json({ title: "invalid data", message: "price must be greater than 0" })
        let isOk = await itemModel.findOne({ SKU: SKU })
        if (isOk)
            return res.status(409).json({ title: "duplicate item", message: "an item with the same SKU already exists" })
        
        const newItem = new itemModel({ SKU, name, description, createDate, imageUrl, price, isAvailable, availableInSize })
        let item = await newItem.save()
        return res.status(201).json(item)
    }
    catch(err){
        return res.status(500).json({ title: "Sorry, We have an error with creating item", message: err })
    }
}

export const updateItem = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        if (!req.params.id)
            return res.status(400).json({ title: "missing id", message: "no id" })
        const SKU = parseInt(req.params.id)
        let { name, description, createDate, imageUrl, price, isAvailable, availableInSize } = req.body

        let updateObject = {}
        if (name !== undefined) updateObject.name = name
        if (description !== undefined) updateObject.description = description
        if (createDate !== undefined) updateObject.createDate = createDate
        if (imageUrl !== undefined) updateObject.imageUrl = imageUrl
        if (price !== undefined) {
            if (price <= 0)
                return res.status(400).json({ title: "invalid data", message: "price must be greater than 0" })
            updateObject.price = price
        }
        if (isAvailable !== undefined) updateObject.isAvailable = isAvailable
        if (availableInSize !== undefined) updateObject.availableInSize = availableInSize

        let item = await itemModel.findOneAndUpdate({SKU: SKU}, updateObject, { new: true })
        if (!item)
            return res.status(404).json({ title: "error updating", message: "Item not found" })

        return res.json(item)
    }
    catch (err) {
        return res.status(500).json({ title: "Error updating item", message: err })
    }
}



export const deleteItem = async (req, res) => {
    try {
        const id = req.params.id

        let d = await itemModel.findByIdAndDelete(id)
        if (!d)
            return res.status(404).json({ title: "error deleting", message: "Item not found" })

        return res.status(200).json(d)
    }
    catch (err) {
        return res.status(500).json({ title: "Error deleting item", message: err })
    }
}