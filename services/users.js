'use strict'


const {BadRequestError} = require('./errors');
const {PrismaClient, Prisma} = require('@prisma/client');
const prisma = new PrismaClient();



const validateUser = function(user){
    if (user.name){
        return user;
    }else{
        throw new BadRequestError("Minimum user properties is missing");
    }
}

const createEmptyUser = async function(req,res){
    try{
        const user = validateUser(req.body);
        await prisma.users.create({data:{
            name: user.name,
            email: user.email || null, 
            birth : user.birth ? new Date(user.birth) : null 
            }});
        return res.status(201).send();
    }catch(e){
        if(e instanceof BadRequestError){
            return res.status(424).send(e);
        }else if(e instanceof Prisma.PrismaClientKnownRequestError){
            return res.status(409).send(e);
        }
        return res.status(500).send(e.message());
    }

}



module.exports = {
    createEmptyUser
}