'use strict'

const {BadRequestError,ErrorHandler} = require('./errors');
const pgObject = require('./pg');


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
        
        const pgClient = new pgObject();
        await pgClient.connect();
        const createdUser = await pgClient.query(`
                INSERT INTO users(name, email, birth) 
                values ('${user.name}','${user.email}',${user.birth?`'${user.birth}'`:"NULL"})
                returning *;`);
        await pgClient.end();

        return res.status(201).send(createdUser.rows);
        }catch(e){
            res.status(ErrorHandler(e)).send(e);
        };
}

const getUserByEmail = async function(searchEmail){
    // if(typeof searchEmail==='string'){
    //     const userReceived =  await prisma.users.findFirstOrThrow({
    //         where:{
    //             email:searchEmail
    //         }
    //     });
    //     return userReceived;
    // }else{
    //     throw new BadRequestError("To get an email it should be valid");
    // }
}

module.exports = {
    createEmptyUser,
    getUserByEmail
}