'use strict'

const user_services = require('./../services/users')

exports.createNewUser = async function(req,res){
    const user = req.body;

    let e = await user_services.createEmptyUser(user);
    console.log(e);

    switch(e){
        case undefined:
            res.status(201).send();
            break;
        case 'Insuficient Parameters':
            res.status(424).send();
            break;
        default:
            res.status(500).send();
    }

}; 
