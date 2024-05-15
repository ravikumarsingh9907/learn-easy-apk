const coursesDb = require('../models/courses');
const usersDb = require('../models/users');
const reviewsDb = require('../models/reviews');
const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const getCourse = await coursesDb.findById(id);
        if(!getCourse) throw new Error('Course not found.');

        const getUser = await usersDb.findById(userId);

        const addReview = new reviewsDb({...req.body, user: getUser._id, course: id});
        await addReview.save();

        res.status(201).send({success: 'Review added successfully.'})
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

const getReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await reviewsDb.find({ course: id})
            .populate('course')
            .populate('user');

        if(!reviews?.length) throw new Error('No reviews available.');

        res.status(200).send(reviews);
    } catch (e) {
        res.status(400).send(e.message);
    }
 }

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        await reviewsDb.findByIdAndUpdate(reviewId, req.body);
        res.status(200).send({'success': 'Updated.'});
    } catch (e) {
        res.status(400).send(e.message);
    }
}

module.exports = Object.freeze({
    addReview,
    getReviews,
    updateReview,
})