const Course = require("../models/courses");
const {uploadOnCloud, removeFromCloud} = require("../cloudinary");

const getCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}).populate('platform');

        if(!allCourses) throw new Error('No course found.')
        res.status(200).send(allCourses);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getCoursesByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const showCourses = await Course.find({category: id}).populate('category');

        if(!showCourses) throw new Error('No course available.');

        res.status(200).send(showCourses);
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const foundCourse = await Course.findById(id);

        if(!foundCourse) throw new Error('Course not found.');

        res.status(200).send(foundCourse);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const addCourse = async (req, res) => {
    try {
        const getCourseByName = await Course.findOne({$or: [{title: req.body.title}, {url: req.body.url}]});
        if(getCourseByName) throw new Error('Course already available.');

        const addCourse = new Course(req.body);

        const bufferImageData = req.file.buffer;
        const uploadResult = await uploadOnCloud('learn-easy/courses', bufferImageData);

        addCourse.image = uploadResult.secure_url;
        addCourse.image_id = uploadResult.public_id;

        await addCourse.save();

        res.status(201).send({success: 'Course added successfully.'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const updateCourse = async (req, res) => {
    try {
        const getCourseByName = await Course.findOne({$or: [{title: req.body.title}, {url: req.body.url}]});
        const { id } = req.params;

        if(getCourseByName) throw new Error('Course already available.');

        if(req.file) {
            const bufferImageData = req.file.buffer;
            const uploadResult = await uploadOnCloud('learn-easy/courses', bufferImageData);

            const getCourseById = await Course.findById(id);
            const removeImageFromCloud = await removeFromCloud(getCourseById.image_id);

            if(removeImageFromCloud.result !== 'ok') {
                throw new Error("Couldn't update image.");
            }

            req.body['image_id'] = uploadResult.public_id;
            req.body['image'] = uploadResult.secure_url;
        }

        await Course.findByIdAndUpdate(id, req.body);

        res.status(201).send({success: 'Course updated successfully.'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const deleteCourse = async (req, res) => {
    try {
        const getCourse = await Course.findById(req.params.id);
        if(!getCourse) throw new Error('Course not found.');

        await removeFromCloud(getCourse.image_id);
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).send({'success': 'Course deleted successfully.'})
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

module.exports = Object.freeze({
    getCourses,
    getCoursesByCategory,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
});