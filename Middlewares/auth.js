const jwt = require('jsonwebtoken');
const usersDb = require('../models/users');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.WEB_TOKEN);

        const user = await usersDb.findOne({
            _id: decode._id,
            tokens: token,
        });

        if(!user) throw Error();

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'})
    }
}