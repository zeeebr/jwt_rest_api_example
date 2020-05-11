const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');


router.post('/registration', user_controller.registration);

router.post('/login', user_controller.login);

router.get('/secret', user_controller.secret);

router.get('/login/refresh', user_controller.refresh);


module.exports = router;