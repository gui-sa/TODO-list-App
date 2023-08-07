'use strict'

const todo_services = require('./../services/todos')


exports.createEmptyTodo = async function(req,res){
    const todo = req.body;

    let e = await todo_services.createEmptyTodo(todo);
    switch(e){
        case undefined:
            res.status(201).send();
            break;
        case 'P2003':
            res.status(424).send();
        default:
            res.status(500).send();
    }
}; 
