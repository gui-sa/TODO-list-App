'use strict'

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createEmptyUser = async function(user){
    await prisma.users.create({data:{
        name:user.name
        }});
}

module.exports = {
    createEmptyUser
}