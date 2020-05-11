const express = require('express');
const router = express.Router();
const index_controller = require('../controllers/indexController');

router.get('/', index_controller.index);

module.exports = router;