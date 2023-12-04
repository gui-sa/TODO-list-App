'use strict'

const express = require('express')
const router = express.Router()
const todosUsers = require('../controllers/users')

router.post('/newuser', todosUsers.createNewUser)

router.post('/getuser', todosUsers.getUserByEmail)

module.exports = router
