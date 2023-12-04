'use strict'

class BadRequestError extends Error {
  constructor (message) {
    super(message)
  }
}

const ErrorHandler = function (err) {
  if (err instanceof BadRequestError) {
    return 400
  } else if (err.code !== 'ECONNREFUSED') {
    return 409
  } else {
    return 500
  }
}

module.exports = {
  BadRequestError,
  ErrorHandler
}
