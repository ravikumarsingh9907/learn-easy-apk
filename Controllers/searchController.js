const CoursesDb = require("../models/courses");

const getSearchData = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await CoursesDb.find({
            $or: [
                {title: { $regex: new RegExp(search, "i") } },
                {instructor: { $regex: new RegExp(search, "i") } },
                {'category.name': { $regex: new RegExp(search, "i") } },
                {tags: { $regex: new RegExp(search, "i") } }
            ]
        }).populate('category');

        res.status(200).send({success: 'Courses found', data: data});
    } catch (e) {
        res.status(400).send({error: e.message});
    }
}

module.exports = Object.freeze({
    getSearchData,
})