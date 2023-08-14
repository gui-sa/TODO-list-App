'use strict'

const todo_services = require('./../services/todos');
const {ErrorHandler} = require('./../services/errors');


// Nao eh necessario propagar o throw no javascript
exports.createEmptyTodo = async function(req,res){
    try{
        // implementar a logica do controlador com base no teste.
        const todo = {
            user_id: 
        }
        await todo_services.createEmptyTodo(todo);
        res.status(201).send();
    }catch(e){
        res.status(ErrorHandler(e)).send(e);   
    }
}; 

exports.findAllTodos = async function(req,res){
    try{
        const todos = await todo_services.findAllTodos();    
        res.status(200).send(todos);    
    }catch(e){
        res.status(500).send(e);
    }
};