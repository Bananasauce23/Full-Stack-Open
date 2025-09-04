const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '');
    } else {
        request.token = null;
    }
    next();
};

const userExtractor = async (request, response, next) => {
    const token = request.token;
    if (!token) {
        request.user = null;
        return next();
    }
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken.id) {
            request.user = null;
            return next();
        }
        const user = await User.findById(decodedToken.id);
        request.user = user;
    } catch (error) {
        request.user = null;
    }
    next();
};

module.exports = {
    tokenExtractor,
    userExtractor
};