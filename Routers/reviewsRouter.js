const express =require('express');
const Router = new express.Router();
const auth = require('../Middlewares/auth');
const { addReview, getReviews, updateReview } = require('../Controllers/reviewsController');

Router.post('/courses/:id/reviews', auth, addReview);
Router.patch('/courses/:id/reviews/:reviewId', auth, updateReview);
Router.post('/courses/:id/reviews', getReviews);

module.exports = Router;