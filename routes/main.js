'use strict'

const express = require('express');
const router = express.Router();
const main_controller = require('./../controllers/main');
const todos_router = require('./todos');
const users_router = require('./users');

router.use('/todos',todos_router);

router.use('/users',users_router);

router.get('/teste',main_controller.testeGet);

router.get('*',main_controller.defaultGet);

module.exports = router;
