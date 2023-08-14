'use strict'


const {BadRequestError,ErrorHandler} = require('./errors');
const prismaSingleton = require('./prisma');
const prisma = prismaSingleton();


const validateUserCreation = function(user){
    if (user.name&&user.email){
        return user;
    }else{
        throw new BadRequestError("Minimum user properties is missing");
    }
}
// Correcao: servicos nao deveria lidar com req,res... Quem lida com isso eh a camada de controle
// Por isso foi osso testar.
// Nao faz sentido testar o prisma porque teoricamente esse servico eh safe
const createEmptyUser = async function(req,res){
        try{
        const user = validateUserCreation(req.body);
        await prisma.users.create({data:{
            name: user.name,
            email: user.email, 
            birth : user.birth ? new Date(user.birth) : null 
            }});
        return res.status(201).send();
        }catch(e){
            res.status(ErrorHandler(e)).send(e);
        };
}


module.exports = {
    createEmptyUser
}