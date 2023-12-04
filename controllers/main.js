'use strict'

exports.defaultGet = function (req, res) {
  res.status(200).send('<html><head></head><body><h1>Page Not Found</h1></body></html>')
}

exports.testeGet = function (req, res) {
  res.status(200).send('<html><head></head><body><h1>Teste</h1></body></html>')
}
