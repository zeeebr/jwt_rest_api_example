const {
    User
} = require('../models/db');
const user = new User();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../env.js');


exports.registration = async (req, res, next) => {
    if (req.body.password !== req.body.repeatPassword) {
        const err = new Error('Password mismatch!');
        err.status = 400;
        next(err);
    }

    let checkName = await user.getUser(req.body.email);

    if (checkName) {
        const err = new Error(`User ${req.body.email} already exists!`);
        err.status = 400;
        next(err);
    }

    data = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }

    user.addUser(data);

    res.json({
        message: `User ${data.email} successfully added!`
    });
}

exports.login = async (req, res, next) => {
    let checkName = await user.getUser(req.body.email);

    if (!checkName) {
        const err = new Error(`User ${req.body.email} not found!`);
        err.status = 400;
        next(err);
    }

    let isValidPassword = await bcrypt.compareSync(req.body.password, checkName.password);

    if (!isValidPassword) {
        const err = new Error(`Wrong password for user ${req.body.email}!`);
        err.status = 400;
        next(err);
    }

    let aToken = jwt.sign({
        iss: 'jwt_rest_api_example',
        sub: 'access',
        email: req.body.email
    }, env.SECRET_KEY, {
        expiresIn: '1h'
    });

    let rToken = jwt.sign({
        iss: 'jwt_rest_api_example',
        sub: 'refresh',
        email: req.body.email
    }, env.SECRET_KEY, {
        expiresIn: '30d'
    });

    user.addToken([{
        email: req.body.email,
        refreshToken: rToken
    }])

    res.json({
        access_token: aToken,
        refresh_token: rToken
    });
}

exports.refresh = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token.startsWith('Bearer ')) {
        token = token.substring(7, token.length);
    } else {
        const err = new Error('missing token');
        err.status = 401;
        next(err);
    }

    jwt.verify(token, env.SECRET_KEY, async function (error, decoded) {
        if (!decoded) {
            const err = new Error(error.message);
            err.status = 401;
            next(err);
        }

        let checkName = await user.getUser(decoded.email);

        if (token !== checkName.refreshToken) {
            const err = new Error('wrong token');
            err.status = 401;
            next(err);
        } else {
            let aToken = jwt.sign({
                iss: 'jwt_rest_api_example',
                sub: 'access',
                email: decoded.email
            }, env.SECRET_KEY, {
                expiresIn: '1h'
            });
        
            let rToken = jwt.sign({
                iss: 'jwt_rest_api_example',
                sub: 'refresh',
                email: decoded.email
            }, env.SECRET_KEY, {
                expiresIn: '30d'
            });
        
            user.addToken([{
                email: decoded.email,
                refreshToken: rToken
            }])
        
            res.json({
                message: `Here are your new tokens!`,
                access_token: aToken,
                refresh_token: rToken
            });
        }
    })
}

exports.secret = (req, res) => {
    res.json({
        message: 'Secret page! :)'
    })
    //res.redirect('/secret_page')
}

exports.logout = (req, res) => {
    user.addToken([{
        email: req.body.email,
        refreshToken: undefined
    }])

    res.json({
        message: 'You are logout!'
    })
}