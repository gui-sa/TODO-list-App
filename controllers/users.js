'use strict'

const userServices = require('./../services/users')
const { ErrorHandler, BadRequestError } = require('./../services/errors')

const validateUserCreation = function (user) {
  if (user.name && user.email) {
    return user
  } else {
    throw new BadRequestError('Minimum user properties is missing')
  }
}

exports.createNewUser = async function (req, res) {
  try {
    const user = validateUserCreation(req.body)
    const createdUser = await userServices.createEmptyUser(user)
    res.status(201).send(createdUser)
  } catch (e) {
    res.status(ErrorHandler(e)).send(e)
  };
}

exports.getUserByEmail = async function (req, res) {
  // try{
  //     const userReceived = await userServices.getUserByEmail(req.body.email);
  //     //console.log(userReceived);
  //     res.status(200).send(userReceived);
  // }catch(e){
  //     res.status(ErrorHandler(e)).send(e);
  // }
}
