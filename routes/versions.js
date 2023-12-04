'use strict'


const express = require('express');
const router = express.Router();
const todos_router = require('./todos');
const users_router = require('./users');

router.use('/todos',todos_router);

router.use('/users',users_router);


module.exports = router;
