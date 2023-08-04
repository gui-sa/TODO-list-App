'use strict'

const express = require('express');
const router = express.Router();
const main_controller = require('./../controllers/main');


router.get('/teste',main_controller.testeGet);

router.get('*',main_controller.defaultGet);

module.exports = router;
