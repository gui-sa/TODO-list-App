'use strict'

const user_services = require('./../services/users')
const {ErrorHandler} = require('./../services/errors');

//Favor, ler a sugestao de melhoria no servico
exports.createNewUser = function(req,res){
    user_services.createEmptyUser(req,res);
}; 

// Sem misturar servico com controlador
exports.getUserByEmail = async function(req,res){
    try{
        const userReceived = await user_services.getUserByEmail(req.body.email);
        //console.log(userReceived);
        res.status(200).send(userReceived);
    }catch(e){
        res.status(ErrorHandler(e)).send(e);
    }
};