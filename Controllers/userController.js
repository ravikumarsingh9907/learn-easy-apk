const usersDb = require("../models/users");
const bookmarksDb = require('../models/bookmarks');
const coursesDb = require('../models/courses');

const getUser = async (req, res) => {
    try {
        const id = req.user._id;
        const findUser = await usersDb.findById(id);

        if(!findUser) throw new Error('Please Authenticate.');

        res.status(200).send(findUser);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
}
const getUserBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const getBookmarks = await bookmarksDb.find({user: id}).populate('user').populate('course');

        if(!getBookmarks) throw new Error('No bookmark added.');

        res.status(200).send(getBookmarks);
    } catch {
        res.status(400).send("Something went wrong at bookmark");
    }
}

const addToBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await coursesDb.findById(id);

        if(!course) throw new Error('Course not found.');

        const user = req.user;
        const getBookmark = await bookmarksDb.findOne({$and: [ {user: user._id}, {course: id}]})
            .populate('user')
            .populate('course');

        if(getBookmark) throw new Error('Already bookmarked.');

        const addBookmark = new bookmarksDb({
            user: user._id,
            course: course._id,
        });

        await addBookmark.save();
        res.status(200).send({success: addBookmark._id});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const removeFromBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        await bookmarksDb.findOneAndRemove({user: id}).populate('user');
        res.status(200).send({success: 'Course removed from bookmark.'})
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

module.exports = Object.freeze({
    getUserBookmark,
    addToBookmark,
    removeFromBookmark,
    getUser,
})