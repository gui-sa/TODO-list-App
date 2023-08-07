'use strict'

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createEmptyUser = async function(user){
    try{
        if (user.name){
            await prisma.users.create({data:{
                name: user.name,
                email: user.email || null, 
                birth : user.birth ? new Date(user.birth) : null 
                }});
        }else{
            throw new Error('Insuficient Parameters');
        }
    }catch(e){
        return e.code;
    }

}

module.exports = {
    createEmptyUser
}