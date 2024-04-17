const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }
}, {
    timestamps: true,
});

const bookmarks = new mongoose.model('bookmark', bookmarkSchema);

module.exports = bookmarks;