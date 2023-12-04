'use strict'

const express = require('express');
const router = express.Router();
const main_controller = require('../controllers/main');
const version_router = require ('./versions')

router.use('/v1', version_router);

router.get('/teste',main_controller.testeGet);

router.get('*',main_controller.defaultGet);

module.exports = router;
// uma sugestao 