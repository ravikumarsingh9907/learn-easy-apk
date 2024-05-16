const Course = require("../models/courses");
const {uploadOnCloud, removeFromCloud} = require("../cloudinary");
const aboutCourseDb = require('../models/aboutCourse');
const mongoose = require("mongoose");

function prepareFilter(query) {
    const sortFieldName = query.sort ? query.sort : 'createdAt';
    const sortObj = {};
    sortObj[sortFieldName] = 1;

    const ratingFields = query.rating ? query.rating : '';
    const priceFields = query.price ? query.price.split(',') : '';
    const limit = query.limit ? query.limit : 10;
    const skip = query.skip ? query.skip : 0;

    return {sortObj, ratingFields, priceFields, limit, skip}
 }
const getCourses = async (req, res) => {
    try {
        const {sortObj, ratingFields, priceFields, limit, skip} = prepareFilter(req.query);

        const prepareQuery = {};
        if(priceFields && priceFields.length) prepareQuery['price'] = {$in: priceFields};

        const courseCount = await Course.aggregate([
            {$match: prepareQuery},
            {$lookup: {
                    from: 'platforms',
                    localField: 'platform',
                    foreignField: '_id',
                    as: 'platform',
                }
            },
            {$lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                }
            }]).count('courses');

        const showCourses = await Course.aggregate([
            {$match: prepareQuery},
            {$lookup: {
                    from: 'platforms',
                    localField: 'platform',
                    foreignField: '_id',
                    as: 'platform',
                }
            },
            {$lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                }
            },
            {
                $unwind: '$category', // Unwind the array created by $lookup
            },
            {
                $unwind: '$platform', // Unwind the array created by $lookup
            },
            {$sort: sortObj},
            {$limit: +limit},
            {$skip: +skip}
        ]);

        if(!showCourses) throw new Error('No course found.')
        res.status(200).send({items: showCourses, count: courseCount[0].courses});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getCoursesByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const {sortObj, ratingFields, priceFields, limit, skip} = prepareFilter(req.query);

        const prepareQuery = {};
        prepareQuery['category'] = mongoose.Types.ObjectId(id);
        if(priceFields && priceFields.length) prepareQuery['price'] = {$in: priceFields};

        const courseCount = await Course.aggregate([
            {$match: prepareQuery},
            {$lookup: {
                    from: 'platforms',
                    localField: 'platform',
                    foreignField: '_id',
                    as: 'platform',
                }
            },
            {$lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                }
            }]).count('courses');

        const showCourses = await Course.aggregate([
            {$match: prepareQuery},
            {$lookup: {
                from: 'platforms',
                localField: 'platform',
                foreignField: '_id',
                as: 'platform',
                }
            },
            {$lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
                }
            },
            {
                $unwind: '$category', // Unwind the array created by $lookup
            },
            {
                $unwind: '$platform', // Unwind the array created by $lookup
            },
            {$sort: sortObj},
            {$limit: +limit},
            {$skip: +skip}
        ]);

        if(!showCourses) throw new Error('No course available.');

        res.status(200).send({items: showCourses, count: courseCount[0].courses});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const foundCourse = await Course.findById(id).populate('platform');

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

        res.status(201).send({success: 'Course added successfully.', id: addCourse._id});
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

const addAboutCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const {prerequisites, knowledge} = req.body;

        const getAboutCourse = await aboutCourseDb?.find({course: id}).populate('course');

        if(getAboutCourse?.length > 0) throw new Error('About course already added.');

        const aboutCourse = new aboutCourseDb({
            prerequisites: JSON.stringify(prerequisites),
            knowledge: JSON.stringify(knowledge),
            course: id,
        });

        await aboutCourse?.save();

        res.status(201).send({success: 'Details added successfully.'})
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const getAboutCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const aboutCourse = await aboutCourseDb?.findOne({course: id}).populate('course');

        if(!aboutCourse) throw new Error('About course not found.');

        const aboutCourseObj = aboutCourse.toObject();

        aboutCourseObj['prerequisites'] = JSON.parse(aboutCourseObj.prerequisites);
        aboutCourseObj['knowledge'] = JSON.parse(aboutCourseObj.knowledge);

        res.status(200).send(aboutCourseObj);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const updateAboutCourse = async (req, res) => {
    try {
        const { id, courseId } = req.params;
        const aboutCourse = await aboutCourseDb?.findOne({course: courseId, _id: id}).populate('course');

        if(!aboutCourse) throw new Error('About course not found.');

        await aboutCourseDb?.findByIdAndUpdate(id, {
            prerequisites: JSON.stringify(req.body.prerequisites),
            knowledge: JSON.stringify(req.body.knowledge)
        });

        res.status(200).send({success: 'Course updated successfully.'});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const deleteAboutCourse = async (req, res) => {
    try {
        const { id, courseId } = req.params;
        const aboutCourse = await aboutCourseDb?.findOne({course: courseId, _id: id}).populate('course');

        if(!aboutCourse) throw new Error('About course not found.');

        await aboutCourseDb?.findByIdAndDelete(id);

        res.status(200).send({success: 'Course deleted successfully.'});
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
    addAboutCourse,
    getAboutCourse,
    updateAboutCourse,
    deleteAboutCourse,
});