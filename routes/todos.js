'use strict'

const express = require('express');
const router = express.Router();
const todos_controller = require('./../controllers/todos');

router.post('/newtodo',todos_controller.createEmptyList);


module.exports = router;