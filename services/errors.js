'use strict'

const {Prisma} = require('@prisma/client');

class BadRequestError extends Error{
    constructor(message){
        super(message);
    }
}

const ErrorHandler = function(err){
    if (err instanceof BadRequestError){
        return 400;
    }else if(err instanceof Prisma.PrismaClientKnownRequestError){
        return 409;
    }else{
        return 500;
    }
};


module.exports={
    BadRequestError,
    ErrorHandler
};