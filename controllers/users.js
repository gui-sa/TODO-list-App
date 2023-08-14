'use strict'

const user_services = require('./../services/users')

//Favor, ler a sugestao de melhoria no servico
exports.createNewUser = function(req,res){
    user_services.createEmptyUser(req,res);
}; 
