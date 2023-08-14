'use strict'


const {BadRequestError} = require('./errors');
const {Prisma } = require('@prisma/client');
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
            if(e instanceof BadRequestError){
                return res.status(424).send(e);
            }else if(e instanceof Prisma.PrismaClientKnownRequestError){
                return res.status(409).send(e);
            }
            return res.status(500).send(e); 
        };
}

const validateUserFind = function(email){
    if (typeof email === 'string'){
        return email;
    }else{
        throw new BadRequestError("Strange data received");
    }
}

// Correcao: servicos nao deveria lidar com req,res... Quem lida com isso eh a camada de controle
// Por isso foi osso testar.
const findUserByEmail = async function(req,res){
    try{
        const searchEmail = validateUserFind(req.body);
        const dataResponse = await prisma.users.findFirst({
            where:{
                email:{
                    startsWith:searchEmail
                }
            }
        });
        return res.status(200).send(dataResponse);
    }catch(e){
        if(e instanceof BadRequestError){
            return res.status(400).send(e);
        }else if(e instanceof Prisma.PrismaClientUnknownRequestError){
            return res.status(204).send({});
        }else{
            return res.status(500).send(e); 
        }
    }
}

module.exports = {
    createEmptyUser,
    findUserByEmail
}