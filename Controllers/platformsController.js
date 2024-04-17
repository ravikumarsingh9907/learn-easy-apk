const platFormsDb = require("../models/platforms");
const { uploadOnCloud, removeFromCloud } = require('../cloudinary/index');
const getPlatforms = async (req, res) => {
    try {
        const platforms = await platFormsDb.find({});

        if(!platforms) throw new Error('No categories found.')

        res.status(200).send(platforms);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const addPlatform = async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;
        const { name } = req.body;

        const uploadResult = await uploadOnCloud('learn-easy/platforms', imageBuffer);

        const addPlatform = new platFormsDb({
            image: uploadResult.secure_url,
            name,
            image_id: uploadResult.public_id,
        });

        await addPlatform.save();
        res.status(201).send({success: 'Platform added successfully.'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const updatePlatform = async (req, res) => {
    try {
        const { id } = req.params;
        const platform = await platFormsDb.findById(id);
        if(!platform) throw new Error('Platform not found.');

        const bufferImageData = req.file.buffer;
        const removeImageFromCloud = await removeFromCloud(platform.image_id);

        if(removeImageFromCloud.result !== 'ok') {
            throw new Error("Couldn't update platform icon.");
        }

        const uploadResult = await uploadOnCloud('learn-easy/categories', bufferImageData);
        platform.image = uploadResult.secure_url;
        platform.image_id = uploadResult.public_id;
        await platform.save();

        res.status(200).send({success: 'Platform updated successfully.'})
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const deletePlatform = async (req, res) => {
    try {
        const { id } = req.params;
        const platform = await platFormsDb.findById(id);

        if(!platform) throw new Error('Category not found.');

        const { result } = await removeFromCloud(platform.image_id);
        if(result !== 'ok') {
            throw new Error("Couldn't delete platform.");
        }

        await platform.findByIdAndDelete(id);
        res.status(200).send({success: 'Platform deleted successfully.'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

module.exports = Object.freeze({
    getPlatforms,
    addPlatform,
    updatePlatform,
    deletePlatform,
});