const express = require('express');
const router = express.Router();
const {
    User
} = require('../models/db');
const user = new User();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../env.js');
router.get('/', (req, res, next) => {
    res.json({
        message: 'Welcome to jwt_rest_api_example!'
    })
});

router.post('/registration', async (req, res, next) => {
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

})

router.post('/login', async (req, res, next) => {
    let checkName = await user.getUser(req.body.email);
    
    if (!checkName) {
        const err = new Error(`User ${req.body.email} not found!`);
        err.status = 400;
        next(err);
    }

    if (!isValidPassword(checkName, req.body.password)) {
        const err = new Error(`Wrong password for user ${req.body.email}!`);
        err.status = 400;
        next(err);
    }

    let aToken = jwt.sign({
        iss: 'zeeebr',
        sub: 'auth'
    }, env.SECRET_KEY, {
        expiresIn: '1h'
    });

    let rToken = jwt.sign({
        iss: 'zeeebr',
        sub: 'rfr'
    }, env.SECRET_KEY, {
        expiresIn: '30d'
    });

    user.addToken([{
        email: req.body.email,
        refreshToken: rToken
    }])

    res.json({
        message: `User successfully sign in!`,
        access_token: aToken,
        refresh_token: rToken
    });
})

router.get('/secret', auth, (req, res) => {
    res.json({
        message: 'Secret page! :)'
    })
})

function auth(req, res, next) {
    let token = req.headers.authorization;

    if (token.startsWith('Bearer ')){
        token = token.substring(7, token.length);
    } else {
        const err = new Error('missing token');
        err.status = 401;
        next(err);
    }
    
    jwt.verify(token, env.SECRET_KEY, function(error, decoded){
        if (!decoded) {
            const err = new Error(error.message);
            err.status = 401;
            next(err);
        } else {
            next()
        }
    })
}

async function isValidPassword(user, password) {
    return await bcrypt.compareSync(password, user.password);
}

module.exports = router;