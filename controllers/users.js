'use strict'

const user_services = require('./../services/users')

exports.createNewUser = function(req,res){
    user_services.createEmptyUser(req,res);
}; 
