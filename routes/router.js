'use strict'

const express = require('express')
const router = express.Router()
const mainController = require('../controllers/main')
const versionRouter = require('./versions')

router.use('/v1', versionRouter)

router.get('/teste', mainController.testeGet)

router.get('*', mainController.defaultGet)

module.exports = router
// uma sugestao
