const express = require('express');
const router = express.Router();
const {
    User
} = require('../models/db');
const user = new User();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

    user.add(data);

    res.json({
        message: `User ${data.email} successfully added!`
    });

})

router.post('/login', async (req, res, next) => {
    let checkName = await user.getUser(req.body.email);
    console.log(checkName)

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
    
    res.json({
        message: `User successfully sign in!`
    });
})

async function isValidPassword(user, password) {
    return await bcrypt.compareSync(password, user.password);
} 

module.exports = router;