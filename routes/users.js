'use strict'

const express = require('express');
const router = express.Router();
const todos_users = require('../controllers/users');

router.post('/newuser',todos_users.createNewUser);

router.post('/getuser',todos_users.getUserByEmail);

module.exports = router;