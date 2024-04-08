const Categories = require("../models/categories");
const Course = require("../models/courses");
const fs = require('fs');
const { uploadOnCloud, removeFromCloud } = require('../cloudinary/index');
const getCategories = async (req, res) => {
    try {
        const getCategories = await Categories.find({});

        if(!getCategories) throw new Error('No categories found.')

        res.status(200).send(getCategories);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const addCategory = async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;
        const { categoryName } = req.body;

        const uploadResult = await uploadOnCloud('learn-easy/categories', imageBuffer);

        const addCategory = new Categories({
            image: uploadResult.secure_url,
            name: categoryName,
            image_id: uploadResult.public_id,
        });

        await addCategory.save();
        res.status(201).send({success: 'Category added successfully.'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const getCategoryById = await Categories.findById(id);
        if(!getCategoryById) throw new Error('Category not found.');

        const bufferImageData = req.file.buffer;
        const removeImageFromCloud = await removeFromCloud(getCategoryById.image_id);

        if(removeImageFromCloud.result !== 'ok') {
            throw new Error("Couldn't update image.");
        }

        const uploadResult = await uploadOnCloud('learn-easy/categories', bufferImageData);
        getCategoryById.image = uploadResult.secure_url;
        getCategoryById.image_id = uploadResult.public_id;
        await getCategoryById.save();

        res.status(200).send({success: 'Course updated successfully.'})
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const getCategoryById = await Categories.findById(id);

        if(!getCategoryById) throw new Error('Category not found.');

        const { result } = await deleteCategory(getCategoryById.image_id);
        if(result !== 'ok') {
            throw new Error("Couldn't delete category.");
        }

        await Categories.findOneAndRemove(id);
        res.status(200).send({success: 'Category deleted successfully.'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

module.exports = Object.freeze({
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
});