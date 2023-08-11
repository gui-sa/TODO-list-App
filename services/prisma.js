const {PrismaClient, Prisma} = require('@prisma/client');
const prisma = new PrismaClient();

function prismaSingleton(){
    if (this.client){
        return this.client;
    }else{
        this.client = new PrismaClient();
        return this.client;
    }
}

module.exports = prismaSingleton;