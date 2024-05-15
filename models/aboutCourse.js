const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutCourseSchema = new Schema({
    prerequisites: {
        type: String,
        required: true,
    },
    knowledge: {
      type: String,
      required: true,
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }
}, {
    timestamps: true,
});

const AboutCourse = new mongoose.model('aboutCourse', aboutCourseSchema);

module.exports = AboutCourse;