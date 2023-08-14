'use strict'

const user_services = require('./../services/users')

//Favor, ler a sugestao de melhoria no servico
exports.createNewUser = function(req,res){
    user_services.createEmptyUser(req,res);
}; 

//Favor, ler a sugestao de melhoria no servico
exports.findUser = function(req,res){
    user_services.findUserByEmail(req,res);
};