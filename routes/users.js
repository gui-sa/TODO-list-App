'use strict'

const express = require('express');
const router = express.Router();
const todos_users = require('../controllers/users');

router.post('/newuser',todos_users.createNewUser);

router.get('/getuser',todos_users.findUser);

module.exports = router;