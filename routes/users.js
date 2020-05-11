const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const { auth } = require('../utils');


router.post('/registration', user_controller.registration);

router.post('/login', user_controller.login);

router.get('/login/refresh', user_controller.refresh);

router.get('/secret', auth, user_controller.secret);

router.get('/logout', auth, user_controller.logout)


module.exports = router;