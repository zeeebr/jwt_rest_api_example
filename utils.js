const jwt = require('jsonwebtoken');
const env = require('./env.js');

exports.auth = (req, res, next) => {
    let token = req.headers.authorization;

    if (token.startsWith('Bearer ')) {
        token = token.substring(7, token.length);
    } else {
        const err = new Error('missing token');
        err.status = 401;
        next(err);
    }

    jwt.verify(token, env.SECRET_KEY, function (error, decoded) {
        if (!decoded) {
            const err = new Error(error.message);
            err.status = 401;
            next(err);
        } 
        if (decoded.sub !== 'access') {
            const err = new Error('wrong token');
            err.status = 401;
            next(err);
        } else {
            next()
        }
    })
}