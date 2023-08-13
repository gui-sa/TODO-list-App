const {PrismaClient, Prisma} = require('@prisma/client');
const prisma = new PrismaClient();

function prismaSingleton(){
    return prisma;
}

module.exports = prismaSingleton;

// Node cacheia o objeto.