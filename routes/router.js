'use strict'

const express = require('express')
const router = express.Router()
const mainController = require('../controllers/main')
const versionRouter = require('./versions')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/v1', versionRouter)

router.get('/teste', mainController.testeGet)

router.use('/api-docs', swaggerUi.serve)

router.get('/api-docs', swaggerUi.setup(swaggerDocument))

router.get('*', mainController.defaultGet)

module.exports = router
// uma sugestao
